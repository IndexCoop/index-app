import { Token } from '@/constants/tokens'

import { Quote, QuoteResults, QuoteType, ZeroExQuote } from '../types'
import { isAvailableForFlashMint, isAvailableForSwap } from '../utils/available'

import { getBestQuote } from './best-quote'

export function getQuoteResults(
  indexToken: Token,
  quote0x: ZeroExQuote | null,
  quoteFlashMint: Quote | null,
): QuoteResults {
  const bestQuote = getBestQuote(
    quote0x?.fullCostsInUsd ?? null,
    quoteFlashMint?.fullCostsInUsd ?? null,
    quote0x?.outputTokenAmountUsdAfterFees ?? null,
    quoteFlashMint?.outputTokenAmountUsdAfterFees ?? null,
  )
  const canFlashmintIndexToken = isAvailableForFlashMint(indexToken)
  const canSwapIndexToken = isAvailableForSwap(indexToken)
  return {
    bestQuote,
    results: {
      flashmint: {
        type: QuoteType.flashmint,
        isAvailable: canFlashmintIndexToken,
        quote: quoteFlashMint,
        error: null,
      },
      index: {
        type: QuoteType.index,
        isAvailable: canSwapIndexToken,
        quote: quote0x,
        error: null,
      },
      issuance: {
        type: QuoteType.issuance,
        isAvailable: false,
        quote: null,
        error: null,
      },
      redemption: {
        type: QuoteType.redemption,
        isAvailable: false,
        quote: null,
        error: null,
      },
    },
  }
}
