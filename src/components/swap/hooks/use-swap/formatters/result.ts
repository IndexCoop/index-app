import { formatUnits } from 'viem'

import {
  Quote,
  QuoteResult,
  QuoteType,
  ZeroExQuote,
} from '@/lib/hooks/use-best-quote/types'
import { QuoteDisplay } from '@/components/swap/components/quote-result/types'
import { Token } from '@/constants/tokens'

export interface FormattedQuoteDisplay {
  type: string
  quote?: QuoteDisplay
}

function formattedFeesGas(fees: number, route: string) {
  return `$${fees.toFixed(2)} via ${route}`
}

function formattedFeesTotal(fees: number) {
  return `= $${fees.toFixed(2)} after fees`
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
      feesTotal: formattedFeesTotal(quote.fullCostsInUsd ?? 0),
    },
  }
}

export function getFormattedQuoteResults(
  quoteResult: QuoteResult | null
): FormattedQuoteDisplay[] {
  if (!quoteResult) return []
  const { quotes } = quoteResult
  if (!quotes) return []
  const flashmintQuote = quotes.flashmint
    ? formatQuoteForDisplay(
        quotes.flashmint,
        quoteResult.bestQuote === QuoteType.flashmint
      )
    : null
  const zeroexQuote = quotes.zeroex
    ? formatQuoteForDisplay(
        quotes.zeroex,
        quoteResult.bestQuote === QuoteType.zeroex
      )
    : null
  const formattedQuotes: FormattedQuoteDisplay[] = []
  if (flashmintQuote) {
    formattedQuotes.push(flashmintQuote)
  }
  if (zeroexQuote) {
    formattedQuotes.push(zeroexQuote)
  }
  return formattedQuotes
}
