import { BigNumber } from '@ethersproject/bignumber'

import { Token } from 'constants/tokens'
import { FlashMintQuoteResult } from 'hooks/useFlashMintQuote'

export type TransactionReview = {
  chainId: number
  contractAddress: string
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  inputTokenAmount: BigNumber
  outputTokenAmount: BigNumber
  quoteResult: FlashMintQuoteResult
  slippage: number
}
