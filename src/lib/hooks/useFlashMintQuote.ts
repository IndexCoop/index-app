import { BigNumber } from '@ethersproject/bignumber'

import { EnhancedFlashMintQuote } from './use-best-quote/types'

export type FlashMintQuoteResult = {
  quotes: {
    flashMint: EnhancedFlashMintQuote | null
  }
  inputTokenBalance: BigNumber
  slippage: number
}
