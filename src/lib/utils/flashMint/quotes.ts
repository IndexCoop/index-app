import { BigNumber } from '@ethersproject/bignumber'

import { FlashMintQuoteResult } from '@/lib/hooks/useFlashMintQuote'

export const getContractForQuote = (
  quoteResult: FlashMintQuoteResult | null,
  chainId: number | undefined
): string | null => {
  const quotes = quoteResult?.quotes
  if (!quotes || !chainId) return null

  if (quotes.flashMint) {
    return quotes.flashMint.contract
  }

  return null
}

export const getQuoteAmount = (
  quoteResult: FlashMintQuoteResult | null,
  chainId: number | undefined
): BigNumber | null => {
  const quotes = quoteResult?.quotes
  if (!quotes || !chainId) return null

  if (quotes.flashMint) {
    return quotes.flashMint.inputOutputTokenAmount
  }

  return null
}
