import { PopulatedTransaction } from 'ethers'
import { Hex } from 'viem'

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

export enum QuoteType {
  flashMint = 'flashMint',
  zeroEx = 'zeroEx',
}

export interface Quote {
  type: QuoteType
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
}

export interface EnhancedFlashMintQuote extends Quote {
  contractType: string
  contract: string
  // TODO: should probably use a more general type here (to not rely on ethers lib)
  tx: PopulatedTransaction
}

export interface ZeroExQuote extends Quote {
  chainId: string
  estimatedPriceImpact: string
  data: Hex
  minOutput: BigNumber
  sources: { name: string; proportion: string }[]
  to: string
  value: string
}
