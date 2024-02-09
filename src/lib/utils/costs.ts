import { formatUnits } from 'viem'

export function getFullCostsInUsd(
  quote: bigint | null | undefined,
  gas: bigint,
  inputTokenDecimals: number,
  inputTokenPrice: number,
  nativeTokenPrice: number
): number | null {
  if (quote === null || quote === undefined) return null
  const quoteAmount = formatUnits(quote, inputTokenDecimals)
  const quotePrice = parseFloat(quoteAmount) * inputTokenPrice
  const gasPrice = getGasCostsInUsd(gas, nativeTokenPrice)
  return quotePrice + gasPrice
}

export function getGasCostsInUsd(
  gas: bigint,
  nativeTokenPrice: number
): number {
  const gasAmount = formatUnits(gas, 18)
  const gasPrice = parseFloat(gasAmount) * nativeTokenPrice
  return gasPrice
}
