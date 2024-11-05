import { Token } from '@/constants/tokens'

import { Quote, QuoteResults, QuoteType, ZeroExQuote } from '../types'
import {
  isAvailableForFlashMint,
  isAvailableForRedemption,
  isAvailableForSwap,
} from '../utils/available'

import { getBestQuote } from './best-quote'

export function getQuoteResults(
  indexToken: Token,
  inputToken: Token,
  outputToken: Token,
  quote0x: ZeroExQuote | null,
  quoteFlashMint: Quote | null,
  quoteIssuance: Quote | null,
  quoteRedemption: Quote | null,
): QuoteResults {
  if (isAvailableForRedemption(inputToken, outputToken)) {
    return {
      bestQuote: QuoteType.redemption,
      results: {
        flashmint: {
          type: QuoteType.flashmint,
          isAvailable: false,
          quote: null,
          error: null,
        },
        index: {
          type: QuoteType.index,
          isAvailable: false,
          quote: null,
          error: null,
        },
        issuance: {
          type: QuoteType.issuance,
          isAvailable: true,
          quote: null,
          error: null,
        },
        redemption: {
          type: QuoteType.redemption,
          isAvailable: true,
          quote: quoteRedemption,
          error: null,
        },
      },
    }
  }
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
