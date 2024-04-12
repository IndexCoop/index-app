import { formatWei } from '@/lib/utils'

export function getFullCostsInUsd(
  quote: bigint | null | undefined,
  gas: bigint,
  inputTokenDecimals: number,
  inputTokenPrice: number,
  nativeTokenPrice: number,
): number | null {
  if (quote === null || quote === undefined) return null
  const quoteAmount = formatWei(quote, inputTokenDecimals)
  const quotePrice = parseFloat(quoteAmount) * inputTokenPrice
  const gasPrice = getGasCostsInUsd(gas, nativeTokenPrice)
  return quotePrice + gasPrice
}

export function getGasCostsInUsd(
  gas: bigint,
  nativeTokenPrice: number,
): number {
  const gasAmount = formatWei(gas)
  const gasPrice = parseFloat(gasAmount) * nativeTokenPrice
  return gasPrice
}
