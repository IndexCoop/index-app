import { slippageDefault, slippageMap } from '@/constants/slippage'

export function getSlippageOverrideOrNull(address: string): number | null {
  return slippageMap.get(address) ?? null
}

export function selectSlippage(slippage: number, address: string): number {
  const slippageOverrride = getSlippageOverrideOrNull(address)
  if (slippageOverrride && slippage < slippageOverrride)
    return slippageOverrride
  if (slippageOverrride && slippage > slippageOverrride)
    return slippageDefault === slippage ? slippageOverrride : slippage
  return slippageOverrride ?? slippage
}
