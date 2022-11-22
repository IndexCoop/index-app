import { BigNumber } from '@ethersproject/bignumber'

import { Token } from 'constants/tokens'

export type TransactionReview = {
  inputToken: Token
  outputToken: Token
  inputTokenAmount: BigNumber
  outputTokenAmount: BigNumber
}
