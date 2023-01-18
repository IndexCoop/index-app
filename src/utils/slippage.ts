import { slippageDefault, slippageMap } from 'constants/slippage'
import { DiversifiedStakedETHIndex, USDC } from 'constants/tokens'

export function getSlippageOverrideOrNull(
  tokenSymbol: string,
  inputOutputTokenSymbol: string
): number | null {
  if (
    tokenSymbol === DiversifiedStakedETHIndex.symbol &&
    inputOutputTokenSymbol === USDC.symbol
  ) {
    return 0.1
  }
  return slippageMap.get(tokenSymbol) ?? null
}

export function selectSlippage(
  slippage: number,
  indexSymbol: string,
  inputOutputTokenSymbol: string
): number {
  if (slippage !== slippageDefault) return slippage
  const slippageOverrride = getSlippageOverrideOrNull(
    indexSymbol,
    inputOutputTokenSymbol
  )
  return slippageOverrride ?? slippage
}
