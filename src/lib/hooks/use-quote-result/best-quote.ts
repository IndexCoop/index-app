import { Quote, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getBestQuote } from '@/lib/hooks/use-best-quote/utils/best-quote'

export function getBestYieldQuote(
  flashmintQuote: Quote | null,
  swapQuote: Quote | null,
  chainId: number,
): Quote | null {
  if (!flashmintQuote && swapQuote) return swapQuote
  if (flashmintQuote && !swapQuote) return flashmintQuote
  if (
    flashmintQuote &&
    flashmintQuote.chainId !== chainId &&
    swapQuote &&
    swapQuote.chainId === chainId
  )
    return swapQuote
  if (
    flashmintQuote &&
    flashmintQuote.chainId === chainId &&
    swapQuote &&
    swapQuote.chainId !== chainId
  )
    return flashmintQuote
  if (flashmintQuote && swapQuote) {
    const bestQuoteType = getBestQuote(
      swapQuote.fullCostsInUsd,
      flashmintQuote.fullCostsInUsd,
      swapQuote.outputTokenAmountUsdAfterFees,
      flashmintQuote.outputTokenAmountUsdAfterFees,
    )
    return bestQuoteType === QuoteType.index ? swapQuote : flashmintQuote
  }
  return null
}
