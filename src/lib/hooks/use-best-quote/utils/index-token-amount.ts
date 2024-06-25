import { parseUnits } from '@/lib/utils'

export const getIndexTokenAmount = (
  isMinting: boolean,
  inputTokenAmount: string,
  inputTokenDecimals: number,
  outputTokenDecimals: number,
  inputTokenPrice: number,
  outputTokenPrice: number,
): bigint => {
  if (!isMinting) {
    return parseUnits(inputTokenAmount, inputTokenDecimals)
  }
  // When minting - calculate an approximate index token amount for FlashMint quotes
  const inputTokenAmountUsd = parseFloat(inputTokenAmount) * inputTokenPrice
  const approxOutputAmount =
    outputTokenPrice === 0 ? 0 : inputTokenAmountUsd / outputTokenPrice
  return parseUnits(approxOutputAmount.toString(), outputTokenDecimals)
}
