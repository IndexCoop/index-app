import { useMemo } from 'react'

import { QuoteResults, QuoteType } from '@/lib/hooks/use-best-quote/types'

import { TransactionReview } from '../components/transaction-review/types'

export function useTransactionReviewModal(
  quoteResults: QuoteResults,
  selectedQuote: QuoteType | null,
  isFetchingQuote: boolean
) {
  const transactionReview = useMemo((): TransactionReview | null => {
    if (isFetchingQuote || selectedQuote === null) return null
    const quote =
      selectedQuote === QuoteType.flashmint
        ? quoteResults.results.flashmint?.quote
        : quoteResults.results.zeroex?.quote
    if (quote) {
      return {
        ...quote,
        contractAddress: quote.contract,
        quoteResults,
        selectedQuote,
      }
    }
    return null
  }, [isFetchingQuote, quoteResults, selectedQuote])
  return { transactionReview }
}
