import { BigNumber } from '@ethersproject/bignumber'

import { toWei } from '@/lib/utils'

import { maxPriceImpact } from './config'

export const getIndexTokenAmount = (
  isMinting: boolean,
  sellTokenAmount: string,
  sellTokenDecimals: number,
  sellTokenPrice: number,
  buyTokenPrice: number,
  dexSwapOption: { buyAmount: string; estimatedPriceImpact: string } | null
): BigNumber => {
  if (!isMinting) {
    return toWei(sellTokenAmount, sellTokenDecimals)
  }

  let setTokenAmount = BigNumber.from(dexSwapOption?.buyAmount ?? '0')

  const priceImpact =
    dexSwapOption && dexSwapOption.estimatedPriceImpact
      ? parseFloat(dexSwapOption.estimatedPriceImpact)
      : 0

  if (!dexSwapOption || priceImpact >= maxPriceImpact) {
    // Recalculate the exchange issue/redeem quotes if not enough DEX liquidity
    const sellTokenTotal = parseFloat(sellTokenAmount) * sellTokenPrice
    const approxOutputAmount =
      buyTokenPrice === 0 ? 0 : Math.floor(sellTokenTotal / buyTokenPrice)
    setTokenAmount = toWei(approxOutputAmount, sellTokenDecimals)
  }

  return setTokenAmount
}
