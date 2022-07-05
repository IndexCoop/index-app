import { BigNumber } from 'ethers'

import { displayFromWei } from 'utils'

export function getFullCostsInUsd(
  quote: BigNumber | null | undefined,
  gas: BigNumber,
  inputTokenDecimals: number,
  inputTokenPrice: number,
  nativeTokenPrice: number
): number | null {
  if (quote === null || quote === undefined) return null
  const g = displayFromWei(gas)?.toString() ?? '0'
  const q =
    displayFromWei(quote, undefined, inputTokenDecimals)?.toString() ?? '0'
  const quotePrice = parseFloat(q) * inputTokenPrice
  const gasPrice = parseFloat(g) * nativeTokenPrice
  return quotePrice + gasPrice
}
