import { Token } from '@/constants/tokens'
import { QuoteResults, QuoteType } from '@/lib/hooks/use-best-quote/types'

export type TransactionReview = {
  chainId: number
  contractAddress: string
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  outputTokenAmount: bigint
  quoteResults: QuoteResults
  selectedQuote: QuoteType
  slippage: number
}
