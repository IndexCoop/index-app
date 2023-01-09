import { slippageDefault, slippageMap } from 'constants/slippage'

export function getSlippageModification(tokenSymbol: string): number | null {
  return slippageMap.get(tokenSymbol) ?? null
}

export function selectSlippage(slippage: number, tokenSymbol: string): number {
  if (slippage !== slippageDefault) return slippage
  const slippageModified = getSlippageModification(tokenSymbol)
  return slippageModified ?? slippage
}
