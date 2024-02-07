import { PopulatedTransaction } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'

import { Token } from '@/constants/tokens'

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

// Could be separated from ethers whenever it's not used any more
export interface QuoteTransaction extends PopulatedTransaction {}

export enum QuoteType {
  flashmint = 'flashmint',
  redemption = 'redemption',
  zeroex = 'zeroex',
}

export interface Quote {
  type: QuoteType
  chainId: number
  contract: string
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  gas: BigNumber
  gasPrice: BigNumber
  gasCosts: BigNumber
  gasCostsInUsd: number
  fullCostsInUsd: number | null
  priceImpact: number | null
  indexTokenAmount: BigNumber
  inputOutputTokenAmount: BigNumber
  // Return additionally for convenience to avoid
  // having to determine based on isMinting
  inputTokenAmount: BigNumber
  inputTokenAmountUsd: number
  outputTokenAmount: BigNumber
  outputTokenAmountUsd: number
  outputTokenAmountUsdAfterFees: number
  inputTokenPrice: number
  outputTokenPrice: number
  slippage: number
  tx: QuoteTransaction
}

export interface ZeroExQuote extends Quote {
  minOutput: BigNumber
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
    zeroex: QuoteResult | null
  }
}
