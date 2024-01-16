import { BigNumber } from '@ethersproject/bignumber'

import { Token } from '@/constants/tokens'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'

export type TransactionReview = {
  chainId: number
  contractAddress: string
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  inputTokenAmount: BigNumber
  outputTokenAmount: BigNumber
  quoteResult: QuoteResult
  selectedQuote: QuoteType
  slippage: number
}
