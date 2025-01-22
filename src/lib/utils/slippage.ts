import { slippageDefault, slippageMap } from '@/constants/slippage'
import { DiversifiedStakedETHIndex, USDC } from '@/constants/tokens'

export function getSlippageOverrideOrNull(
  tokenSymbol: string,
  inputOutputTokenSymbol: string,
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
  inputOutputTokenSymbol: string,
): number {
  const slippageOverrride = getSlippageOverrideOrNull(
    indexSymbol,
    inputOutputTokenSymbol,
  )
  if (slippageOverrride && slippage < slippageOverrride)
    return slippageOverrride
  if (slippageOverrride && slippage > slippageOverrride)
    return slippageDefault === slippage ? slippageOverrride : slippage
  return slippageOverrride ?? slippage
}
