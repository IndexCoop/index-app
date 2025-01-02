import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'

export function usePrepareTransactionReview(
  isFetchingQuote: boolean,
  quoteResult: QuoteResult | null,
) {
  if (isFetchingQuote || quoteResult === null) return null
  const quote = quoteResult.quote
  if (!quote) return null
  return {
    ...quote,
    contractAddress: quote.contract,
    quoteResults: {
      bestQuote: QuoteType.flashmint,
      results: {
        flashmint: quoteResult,
        index: null,
        issuance: null,
        redemption: null,
      },
    },
    selectedQuote: QuoteType.flashmint,
  }
}
