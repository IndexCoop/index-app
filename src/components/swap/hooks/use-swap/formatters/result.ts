import { formatUnits } from 'viem'

import { Quote, QuoteType, ZeroExQuote } from '@/lib/hooks/use-best-quote/types'
import { QuoteDisplay } from '@/components/swap/components/quote/types'
import { Token } from '@/constants/tokens'

interface FormattedQuoteDisplay {
  type: String
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

export function formatQuoteForDisplay(
  quote: Quote,
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
