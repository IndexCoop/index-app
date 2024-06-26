import { QuoteType } from '../types'

export function getBestQuote(
  fullCosts0x: number | null,
  fullCostsFM: number | null,
  totalOutput0x: number | null,
  totalOutputFM: number | null,
): QuoteType {
  if (fullCosts0x !== null && fullCostsFM === null) return QuoteType.index
  if (fullCosts0x === null && fullCostsFM !== null) return QuoteType.flashmint
  if (fullCosts0x && totalOutput0x && fullCostsFM && totalOutputFM) {
    const costsDiff = fullCostsFM - fullCosts0x
    const outputsDiff = totalOutputFM - totalOutput0x
    const diff = outputsDiff - costsDiff
    if (diff > 0) return QuoteType.flashmint
    if (diff < 0) return QuoteType.index
  }
  return QuoteType.index
}
