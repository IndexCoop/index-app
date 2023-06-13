import { BigNumber } from 'ethers'

import { displayFromWei } from '@/lib/utils'

export function getFullCostsInUsd(
  quote: BigNumber | null | undefined,
  gas: BigNumber,
  inputTokenDecimals: number,
  inputTokenPrice: number,
  nativeTokenPrice: number
): number | null {
  if (quote === null || quote === undefined) return null
  const q =
    displayFromWei(quote, undefined, inputTokenDecimals)?.toString() ?? '0'
  const quotePrice = parseFloat(q) * inputTokenPrice
  const gasPrice = getGasCostsInUsd(gas, nativeTokenPrice)
  return quotePrice + gasPrice
}

export function getGasCostsInUsd(
  gas: BigNumber,
  nativeTokenPrice: number
): number {
  const g = displayFromWei(gas)?.toString() ?? '0'
  const gasPrice = parseFloat(g) * nativeTokenPrice
  return gasPrice
}
