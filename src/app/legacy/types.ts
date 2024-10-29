import { Token } from '@/constants/tokens'
import { QuoteResult } from '@/lib/hooks/use-best-quote/types'

export interface LegacyQuote {
  components: string[]
  outputTokens: Token[]
  outputTokenPricesUsd: number[]
  units: bigint[]
}

export interface LegacyRedemptionQuoteResult extends QuoteResult {
  legacy: LegacyQuote | null
}
