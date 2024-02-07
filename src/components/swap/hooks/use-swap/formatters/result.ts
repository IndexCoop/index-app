import { formatUnits } from 'viem'

import {
  Quote,
  QuoteResults,
  QuoteType,
  ZeroExQuote,
} from '@/lib/hooks/use-best-quote/types'
import { QuoteDisplay } from '@/components/swap/components/quote-result/types'
import { Token } from '@/constants/tokens'
import { formatAmount } from '@/lib/utils'

export interface FormattedQuoteDisplay {
  type: string
  isLoading: boolean
  quote?: QuoteDisplay
}

function formattedFeesGas(fees: number, route: string) {
  const maxLength = route.length > 18 ? 20 : route.length
  const formattedRoute =
    route.length > 18 ? `${route.substring(0, maxLength)}...` : route
  return `$${fees.toFixed(2)} via ${formattedRoute}`
}

function formattedFeesTotal(fees: number) {
  return `= $${formatAmount(fees)} after fees`
}

function formattedInputAmount(inputAmount: bigint, token: Token) {
  const formattedInput = Number(
    formatUnits(inputAmount, token.decimals)
  ).toFixed(3)
  return `${formattedInput} ${token.symbol} for`
}

function formattedOuputAmount(outputAmount: bigint, token: Token) {
  const formattedOutput = Number(
    formatUnits(outputAmount, token.decimals)
  ).toFixed(3)
  return `${formattedOutput} ${token.symbol}`
}

function formatLoadingQuoteForDisplay(
  quoteType: QuoteType
): FormattedQuoteDisplay {
  const type = quoteType === QuoteType.flashmint ? 'Flash Mint' : 'Swap'
  return {
    type,
    isLoading: true,
  }
}

function formatQuoteForDisplay(
  quote: Quote | ZeroExQuote,
  isBestQuote: boolean
): FormattedQuoteDisplay {
  const type = quote.type === QuoteType.flashmint ? 'Flash Mint' : 'Swap'
  const route =
    quote.type === QuoteType.flashmint
      ? 'FlashMint'
      : (quote as ZeroExQuote).sources
          .filter((source) => Number(source.proportion) > 0)
          .map((source) => source.name)
          .toString()
  return {
    type,
    isLoading: false,
    quote: {
      type: quote.type,
      isBestQuote,
      inputAmount: formattedInputAmount(
        quote.inputTokenAmount.toBigInt(),
        quote.inputToken
      ),
      outputAmount: formattedOuputAmount(
        quote.outputTokenAmount.toBigInt(),
        quote.outputToken
      ),
      feesGas: formattedFeesGas(quote.gasCostsInUsd, route),
      feesTotal: formattedFeesTotal(quote.outputTokenAmountUsdAfterFees),
    },
  }
}

function formatNotAvailable(type: string): FormattedQuoteDisplay {
  return {
    isLoading: false,
    type,
  }
}

export function getFormattedQuoteResults(
  quoteResult: QuoteResults | null,
  isFetching0x: boolean,
  isFetchingFlashMint: boolean
): FormattedQuoteDisplay[] {
  if (!quoteResult) return []
  const { results } = quoteResult

  const flashmintResults = results.flashmint
  const zeroexResults = results.zeroex

  let flashmintQuote: FormattedQuoteDisplay | null = null
  let zeroexQuote: FormattedQuoteDisplay | null = null

  if (flashmintResults) {
    if (flashmintResults.isAvailable && isFetchingFlashMint) {
      flashmintQuote = formatLoadingQuoteForDisplay(QuoteType.flashmint)
    }
    if (
      flashmintResults.isAvailable &&
      !isFetchingFlashMint &&
      flashmintResults.quote
    ) {
      flashmintQuote = formatQuoteForDisplay(
        flashmintResults.quote,
        quoteResult.bestQuote === QuoteType.flashmint
      )
    }
    if (!flashmintResults.isAvailable && !isFetchingFlashMint) {
      flashmintQuote = formatNotAvailable('Flash Mint')
    }
  }

  if (zeroexResults) {
    if (zeroexResults.isAvailable && isFetching0x) {
      zeroexQuote = formatLoadingQuoteForDisplay(QuoteType.zeroex)
    }
    if (zeroexResults.isAvailable && !isFetching0x && zeroexResults.quote) {
      zeroexQuote = formatQuoteForDisplay(
        zeroexResults.quote,
        quoteResult.bestQuote === QuoteType.zeroex
      )
    }
    if (!zeroexResults.isAvailable && !isFetching0x) {
      zeroexQuote = formatNotAvailable('Swap')
    }
  }

  const formattedQuotes: FormattedQuoteDisplay[] = []
  if (flashmintQuote) {
    formattedQuotes.push(flashmintQuote)
  }
  if (zeroexQuote) {
    formattedQuotes.push(zeroexQuote)
  }
  return formattedQuotes
}
