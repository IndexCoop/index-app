import { BigNumber } from '@ethersproject/bignumber'

import { Token } from 'constants/tokens'

export type TransactionReview = {
  chainId: number
  contractAddress: string
  inputToken: Token
  outputToken: Token
  inputTokenAmount: BigNumber
  outputTokenAmount: BigNumber
}
