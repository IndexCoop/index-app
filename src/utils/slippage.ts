import { slippageMap } from 'constants/slippage'

export function getSlippageModification(tokenSymbol: string): number | null {
  return slippageMap.get(tokenSymbol) ?? null
}
