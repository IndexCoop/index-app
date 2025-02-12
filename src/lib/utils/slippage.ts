import { slippageDefault, slippageMap } from '@/constants/slippage'

export function getSlippageOverrideOrNull(tokenSymbol: string): number | null {
  return slippageMap.get(tokenSymbol) ?? null
}

export function selectSlippage(slippage: number, indexSymbol: string): number {
  const slippageOverrride = getSlippageOverrideOrNull(indexSymbol)
  if (slippageOverrride && slippage < slippageOverrride)
    return slippageOverrride
  if (slippageOverrride && slippage > slippageOverrride)
    return slippageDefault === slippage ? slippageOverrride : slippage
  return slippageOverrride ?? slippage
}
