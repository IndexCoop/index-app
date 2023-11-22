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
  priceImpact: number
  indexTokenAmount: BigNumber
  inputOutputTokenAmount: BigNumber
  slippage: number
  tx: QuoteTransaction
}

// TODO: join args to be part of quote e.g. price impact
// TODO: move everything else into one 0x object and a common tx object (same as FM)
export interface ZeroExQuote extends Quote {
  minOutput: BigNumber
  sources: { name: string; proportion: string }[]
}

export interface QuoteResult {
  bestQuote: QuoteType
  error: Error | null
  quotes: {
    flashmint: Quote | null
    zeroex: ZeroExQuote | null
  }
  isReasonPriceImpact: boolean
  savingsUsd: number
}
