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

export interface LegacyToken {
  name: string
  symbol: string
  address: string | undefined
  decimals: number
  image: string
  chainId?: number
  logoURI?: string
}
