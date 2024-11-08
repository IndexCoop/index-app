import { QuoteDisplay } from '@/components/swap/components/quote-result/types'
import { Token } from '@/constants/tokens'
import {
  Quote,
  QuoteResults,
  QuoteType,
  ZeroExQuote,
} from '@/lib/hooks/use-best-quote/types'
import { formatAmount, formatWei } from '@/lib/utils'

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
  const formattedInput = Number(formatWei(inputAmount, token.decimals)).toFixed(
    3,
  )
  return `${formattedInput} ${token.symbol} for`
}

function formattedOuputAmount(outputAmount: bigint, token: Token) {
  const formattedOutput = Number(
    formatWei(outputAmount, token.decimals),
  ).toLocaleString('en-US', {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3,
  })
  return `${formattedOutput} ${token.symbol}`
}

function formatLoadingQuoteForDisplay(
  quoteType: QuoteType,
): FormattedQuoteDisplay {
  let type = quoteType === QuoteType.flashmint ? 'Flash Mint' : 'Swap'
  if (quoteType === QuoteType.redemption) {
    type = 'Redemption'
  }
  return {
    type,
    isLoading: true,
  }
}

function formatQuoteForDisplay(
  quote: Quote | ZeroExQuote,
  isBestQuote: boolean,
  type: string,
): FormattedQuoteDisplay {
  const route =
    quote.type === QuoteType.index
      ? (quote as ZeroExQuote).sources
          .filter((source) => Number(source.proportion) > 0)
          .map((source) => source.name)
          .toString()
      : type
  return {
    type,
    isLoading: false,
    quote: {
      type: quote.type,
      isBestQuote,
      inputAmount: formattedInputAmount(
        quote.inputTokenAmount,
        quote.inputToken,
      ),
      outputAmount: formattedOuputAmount(
        quote.outputTokenAmount,
        quote.outputToken,
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

export function getFormattedQuoteRedemptionResult(
  quoteResult: QuoteResults | null,
  isFetching: boolean,
): FormattedQuoteDisplay[] {
  if (!quoteResult) return []

  const redemptionResults = quoteResult.results.redemption
  let formattedQuote: FormattedQuoteDisplay | null = null

  if (redemptionResults) {
    if (redemptionResults.isAvailable && isFetching) {
      formattedQuote = formatLoadingQuoteForDisplay(QuoteType.redemption)
    }
    if (
      redemptionResults.isAvailable &&
      !isFetching &&
      redemptionResults.quote
    ) {
      const quote = redemptionResults.quote
      formattedQuote = formatQuoteForDisplay(quote, true, 'Redemption')
    }
    if (!redemptionResults.isAvailable && !isFetching) {
      formattedQuote = formatNotAvailable('Swap')
    }
  }

  const formattedQuotes: FormattedQuoteDisplay[] = []
  if (formattedQuote) {
    formattedQuotes.push(formattedQuote)
  }
  return formattedQuotes
}

export function getFormattedQuoteResults(
  quoteResult: QuoteResults | null,
  isFetching0x: boolean,
  isFetchingFlashMint: boolean,
): FormattedQuoteDisplay[] {
  if (!quoteResult) return []
  const { results } = quoteResult

  const flashmintResults = results.flashmint
  const zeroexResults = results.index

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
        quoteResult.bestQuote === QuoteType.flashmint,
        'Flash Mint',
      )
    }
    if (!flashmintResults.isAvailable && !isFetchingFlashMint) {
      flashmintQuote = formatNotAvailable('Flash Mint')
    }
  }

  if (zeroexResults) {
    if (zeroexResults.isAvailable && isFetching0x) {
      zeroexQuote = formatLoadingQuoteForDisplay(QuoteType.index)
    }
    if (zeroexResults.isAvailable && !isFetching0x && zeroexResults.quote) {
      zeroexQuote = formatQuoteForDisplay(
        zeroexResults.quote,
        quoteResult.bestQuote === QuoteType.index,
        'Swap',
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
