import { useMemo } from 'react'

import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'

import { TransactionReview } from '../components/transaction-review/types'

export function useTransactionReviewModal(
  quoteResult: QuoteResult,
  isFetchingQuote: boolean
) {
  const transactionReview = useMemo((): TransactionReview | null => {
    if (isFetchingQuote) return null
    const isFlashmintBestQuote = quoteResult.bestQuote === QuoteType.flashmint
    const quote = isFlashmintBestQuote
      ? quoteResult.quotes.flashmint
      : quoteResult.quotes.zeroex
    if (quote) {
      return {
        ...quote,
        contractAddress: quote.contract,
        quoteResult,
      }
    }
    return null
  }, [isFetchingQuote, quoteResult])
  return { transactionReview }
}
