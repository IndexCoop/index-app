import { BigNumber } from '@ethersproject/bignumber'

import { Quote } from './use-best-quote/types'

export type FlashMintQuoteResult = {
  quotes: {
    flashMint: Quote | null
  }
  inputTokenBalance: BigNumber
  slippage: number
}
