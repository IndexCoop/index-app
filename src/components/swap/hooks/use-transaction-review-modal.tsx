import { useMemo } from 'react'

import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'

import { TransactionReview } from '../components/transaction-review/types'

export function useTransactionReviewModal(
  quoteResult: QuoteResult,
  selectedQuote: QuoteType | null,
  isFetchingQuote: boolean
) {
  const transactionReview = useMemo((): TransactionReview | null => {
    if (isFetchingQuote || selectedQuote === null) return null
    const quote =
      selectedQuote === QuoteType.flashmint
        ? quoteResult.quotes.flashmint
        : quoteResult.quotes.zeroex
    if (quote) {
      return {
        ...quote,
        contractAddress: quote.contract,
        quoteResult,
        selectedQuote,
      }
    }
    return null
  }, [isFetchingQuote, quoteResult, selectedQuote])
  return { transactionReview }
}
