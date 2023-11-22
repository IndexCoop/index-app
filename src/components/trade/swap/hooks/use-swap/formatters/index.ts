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

export function getFormattedOuputTokenAmount(
  bestOptionIsTypeEI: boolean,
  ouputTokenDecimals: number,
  zeroExTradeDataOutputAmount: BigNumber | undefined,
  exchangeIssuanceOutputAmount: BigNumber | undefined
): string {
  if (
    (bestOptionIsTypeEI && !exchangeIssuanceOutputAmount) ||
    (!bestOptionIsTypeEI && !zeroExTradeDataOutputAmount) ||
    (zeroExTradeDataOutputAmount?.isZero() &&
      exchangeIssuanceOutputAmount?.isZero())
  ) {
    return '0.0'
  }

  if (bestOptionIsTypeEI) {
    return (
      displayFromWei(exchangeIssuanceOutputAmount, 4, ouputTokenDecimals) ??
      '0.0'
    )
  }

  // 0x quotes are always in wei (18 decimals)
  return displayFromWei(zeroExTradeDataOutputAmount, 4, 18) ?? '0.0'
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

const formatIfNumber = (value: string) => {
  if (/[a-z]/i.test(value)) return value

  return Number(value).toLocaleString('en', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

export function shouldShowWarningSign(slippage: number): boolean {
  return slippage > 1
}
