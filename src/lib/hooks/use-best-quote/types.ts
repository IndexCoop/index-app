import type { Token } from '@/constants/tokens'
import type { TransactionRequest } from 'viem'

/**
 * @param slippage The max acceptable slippage, e.g. 3 for 3 %
 */
export interface IndexQuoteRequest {
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  inputTokenAmount: string
  inputTokenPrice: number
  outputTokenPrice: number
  slippage: number
}

export type QuoteTransaction = TransactionRequest & {
  account: string
  chainId: number
}

export enum QuoteType {
  flashmint = 'flashmint',
  index = 'index',
  issuance = 'issuance',
  redemption = 'redemption',
}

export interface Quote {
  type: QuoteType
  chainId: number
  contract: string
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  gas: bigint
  gasPrice: bigint
  gasCosts: bigint
  gasCostsInUsd: number
  fullCostsInUsd: number | null
  priceImpact: number | null
  indexTokenAmount: bigint
  inputOutputTokenAmount: bigint
  // quote amount with no slippage applied
  quoteAmount: bigint
  quoteAmountUsd: number
  // Return additionally for convenience to avoid
  // having to determine based on isMinting
  inputTokenAmount: bigint
  inputTokenAmountUsd: number
  outputTokenAmount: bigint
  outputTokenAmountUsd: number
  outputTokenAmountUsdAfterFees: number
  inputTokenPrice: number
  outputTokenPrice: number
  fees: {
    mint: number
    mintUsd: number
    redeem: number
    redeemUsd: number
    streaming: number
    streamingUsd: number
  } | null
  priceImpactUsd?: number
  priceImpactPercent?: number
  slippage: number
  warning?: string
  tx: QuoteTransaction
}

export interface ZeroExQuote extends Quote {
  minOutput: bigint
  sources: { name: string; proportion: string }[]
}

export interface QuoteResult {
  type: QuoteType
  isAvailable: boolean
  quote: Quote | null
  error: string | null
}

export interface QuoteResults {
  bestQuote: QuoteType
  results: {
    flashmint: QuoteResult | null
    index: QuoteResult | null
    issuance: QuoteResult | null
    redemption: QuoteResult | null
  }
}
