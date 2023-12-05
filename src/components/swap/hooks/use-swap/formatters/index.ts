import { BigNumber } from '@ethersproject/bignumber'

import { Token } from '@/constants/tokens'
import { displayFromWei } from '@/lib/utils'

import { TradeDetailTokenPrices } from '../../../components/trade-details'

/**
 * Rounds to 2 decimal places. NOT precise, should only be used for display
 */
export function formattedBalance(
  token: Token,
  tokenBalance: BigNumber | undefined
) {
  const zero = '0.00'
  return tokenBalance
    ? displayFromWei(tokenBalance, 2, token.decimals) || zero
    : zero
}

export function getFormattedTokenPrice(
  tokenSymbol: string,
  comparingTokenSymbol: string,
  tokenPrice: number,
  comparingTokenPrice: number
): string {
  const percent =
    comparingTokenPrice === 0 ? 0 : tokenPrice / comparingTokenPrice
  const isFractional = percent % 1 !== 0
  const price = isFractional ? percent.toFixed(3) : percent
  return `1 ${tokenSymbol} = ${price} ${comparingTokenSymbol}`
}

export function getFormattedTokenPrices(
  inputTokenSymbol: string,
  inputTokenUsd: number,
  outputTokenSymbol: string,
  outputTokenUsd: number
): TradeDetailTokenPrices {
  const inputTokenPrice = getFormattedTokenPrice(
    inputTokenSymbol,
    outputTokenSymbol,
    inputTokenUsd,
    outputTokenUsd
  )
  const inputTokenPriceUsd = `($${inputTokenUsd.toFixed(2)})`
  const outputTokenPrice = getFormattedTokenPrice(
    outputTokenSymbol,
    inputTokenSymbol,
    outputTokenUsd,
    inputTokenUsd
  )
  const outputTokenPriceUsd = `($${outputTokenUsd.toFixed(2)})`
  return {
    inputTokenPrice,
    inputTokenPriceUsd,
    outputTokenPrice,
    outputTokenPriceUsd,
  }
}

export function formattedFiat(tokenAmount: number, tokenPrice: number): string {
  const price = (tokenAmount * tokenPrice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return price
}

export const getHasInsufficientFunds = (
  bestOptionUnavailable: boolean,
  sellAmount: BigNumber,
  sellTokenBalance: BigNumber | undefined
): boolean => {
  if (
    bestOptionUnavailable ||
    sellAmount.isZero() ||
    sellAmount.isNegative() ||
    sellTokenBalance === undefined
  )
    return false

  const hasInsufficientFunds = sellAmount.gt(sellTokenBalance)
  return hasInsufficientFunds
}

export function shouldShowWarningSign(slippage: number): boolean {
  return slippage > 1
}
