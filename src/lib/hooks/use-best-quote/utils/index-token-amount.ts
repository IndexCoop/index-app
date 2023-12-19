import { BigNumber } from '@ethersproject/bignumber'

import { toWei } from '@/lib/utils'

import { maxPriceImpact } from '../config'

export const getIndexTokenAmount = (
  isMinting: boolean,
  inputTokenAmount: string,
  inputTokenDecimals: number,
  outputTokenDecimals: number,
  inputTokenPrice: number,
  outputTokenPrice: number,
  dexSwapOption: { buyAmount: string; estimatedPriceImpact: string } | null
): BigNumber => {
  if (!isMinting) {
    return toWei(inputTokenAmount, inputTokenDecimals)
  }

  let indexTokenAmount = dexSwapOption
    ? BigNumber.from(dexSwapOption?.buyAmount ?? '0')
    : BigNumber.from('0')

  const priceImpact =
    dexSwapOption && dexSwapOption.estimatedPriceImpact
      ? parseFloat(dexSwapOption.estimatedPriceImpact)
      : 0

  if (!dexSwapOption || priceImpact >= maxPriceImpact) {
    // Recalculate the exchange issue/redeem quotes if not enough DEX liquidity
    const sellTokenTotal = parseFloat(inputTokenAmount) * inputTokenPrice
    const approxOutputAmount =
      outputTokenPrice === 0 ? 0 : (sellTokenTotal / outputTokenPrice) * 0.99
    indexTokenAmount = toWei(approxOutputAmount, outputTokenDecimals)
  }

  return indexTokenAmount
}