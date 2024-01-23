import { BigNumber } from '@ethersproject/bignumber'

import { toWei } from '@/lib/utils'

export const getIndexTokenAmount = (
  isMinting: boolean,
  inputTokenAmount: string,
  inputTokenDecimals: number,
  outputTokenDecimals: number,
  inputTokenPrice: number,
  outputTokenPrice: number
): BigNumber => {
  if (!isMinting) {
    return toWei(inputTokenAmount, inputTokenDecimals)
  }
  // Recalculate the exchange issue/redeem quotes if not enough DEX liquidity
  const inputTokenAmountUsd = parseFloat(inputTokenAmount) * inputTokenPrice
  const approxOutputAmount =
    outputTokenPrice === 0 ? 0 : (inputTokenAmountUsd / outputTokenPrice) * 0.99
  const indexTokenAmount = toWei(approxOutputAmount, outputTokenDecimals)
  return indexTokenAmount
}
