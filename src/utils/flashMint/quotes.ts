import { BigNumber } from '@ethersproject/bignumber'
import {
  getFlashMintLeveragedContractForToken,
  getFlashMintZeroExContractForToken,
} from '@indexcoop/flash-mint-sdk'

import { FlashMintPerp } from 'constants/contractAddresses'
import { FlashMintQuoteResult } from 'hooks/useFlashMintQuote'
import { FlashMintNotionalContractAddress } from 'utils/flashMintNotional/fmNotionalContract'

export const getContractForQuote = (
  quoteResult: FlashMintQuoteResult | null,
  chainId: number | undefined
): string | null => {
  const quotes = quoteResult?.quotes
  if (!quotes || !chainId) return null

  if (quotes.flashMintPerp) {
    return FlashMintPerp
  }

  if (quotes.flashMintLeveraged) {
    const setToken = quotes.flashMintLeveraged.isMinting
      ? quotes.flashMintLeveraged.outputToken
      : quotes.flashMintLeveraged.inputToken
    return getFlashMintLeveragedContractForToken(
      setToken.symbol,
      undefined,
      chainId
    ).address
  }

  if (quotes.flashMintNotional) {
    return FlashMintNotionalContractAddress
  }

  if (quotes.flashMintZeroEx) {
    const setToken = quotes.flashMintZeroEx.isMinting
      ? quotes.flashMintZeroEx.outputToken
      : quotes.flashMintZeroEx.inputToken
    return getFlashMintZeroExContractForToken(
      setToken.symbol,
      undefined,
      chainId
    ).address
  }

  return null
}

export const getQuoteAmount = (
  quoteResult: FlashMintQuoteResult | null,
  chainId: number | undefined
): BigNumber | null => {
  const quotes = quoteResult?.quotes
  if (!quotes || !chainId) return null

  if (quotes.flashMintPerp) {
    return quotes.flashMintPerp.inputOutputTokenAmount
  }

  if (quotes.flashMintLeveraged) {
    return quotes.flashMintLeveraged.inputOutputTokenAmount
  }

  if (quotes.flashMintNotional) {
    return quotes.flashMintNotional.inputOutputTokenAmount
  }

  if (quotes.flashMintZeroEx) {
    return quotes.flashMintZeroEx.inputOutputTokenAmount
  }

  return null
}
