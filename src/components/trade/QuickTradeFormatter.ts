import { colors } from 'styles/colors'

import { BigNumber } from '@ethersproject/bignumber'

import { Token } from 'constants/tokens'
import { displayFromWei } from 'utils'
import { getNativeToken } from 'utils/tokens'

import { TradeInfoItem } from './TradeInfo'

export function getSlippageColorCoding(
  slippage: number,
  isDarkMode: boolean
): string {
  if (slippage > 5) {
    return colors.icRed
  }

  if (slippage > 1) {
    return colors.icBlue
  }

  return isDarkMode ? colors.icWhite : colors.black
}

export function getPriceImpactColorCoding(
  priceImpact: number,
  isDarkMode: boolean
): string {
  if (priceImpact < -5) {
    return colors.icRed
  }

  if (priceImpact < -3) {
    return colors.icBlue
  }

  return isDarkMode ? colors.icGrayDarkMode : colors.icGrayLightMode
}

/**
 * Returns price impact as percent
 */
export function getPriceImpact(
  inputTokenAmount: number,
  inputTokenPrice: number,
  outputokenAmount: number,
  outputTokenPrice: number
): number | null {
  if (inputTokenAmount <= 0 || outputokenAmount <= 0) {
    return null
  }

  const inputTotal = inputTokenAmount * inputTokenPrice
  const outputTotal = outputokenAmount * outputTokenPrice

  const diff = inputTotal - outputTotal
  const priceImpact = (diff / inputTotal) * -100

  return priceImpact
}

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
    (!bestOptionIsTypeEI && !zeroExTradeDataOutputAmount)
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

export function formattedFiat(tokenAmount: number, tokenPrice: number): string {
  const price = (tokenAmount * tokenPrice).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `$${price}`
}

/**
 * Returns price impact in the format (x.yy%)
 */
export function getFormattedPriceImpact(
  inputTokenAmount: number,
  inputTokenPrice: number,
  outputokenAmount: number,
  outputTokenPrice: number,
  isDarkMode: boolean
): { priceImpact: string; colorCoding: string } | null {
  const priceImpact = getPriceImpact(
    inputTokenAmount,
    inputTokenPrice,
    outputokenAmount,
    outputTokenPrice
  )

  if (!priceImpact) {
    return null
  }

  const colorCoding = getPriceImpactColorCoding(priceImpact, isDarkMode)
  return { priceImpact: `(${priceImpact.toFixed(2)}%)`, colorCoding }
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

  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

export function getTradeInfoDataFromEI(
  setAmount: BigNumber,
  gasPrice: BigNumber,
  gasLimit: BigNumber,
  buyToken: Token,
  sellToken: Token,
  inputOutputTokenAmount: BigNumber,
  chainId: number = 1,
  isBuying: boolean,
  navData: TradeInfoItem | null = null
): TradeInfoItem[] {
  const setTokenDecimals = isBuying ? buyToken.decimals : sellToken.decimals
  const inputTokenDecimals = sellToken.decimals
  const exactSetAmount = displayFromWei(setAmount, 4, setTokenDecimals) ?? '0.0'
  const exactSetAmountFormatted = formatIfNumber(exactSetAmount)
  const inputTokenMax = inputOutputTokenAmount
  const maxPayment =
    displayFromWei(inputTokenMax, 4, inputTokenDecimals) ?? '0.0'
  const maxPaymentFormatted = formatIfNumber(maxPayment)
  const networkFee = displayFromWei(gasPrice.mul(gasLimit))
  const networkFeeDisplay = networkFee ? parseFloat(networkFee).toFixed(4) : '-'
  const networkToken = getNativeToken(chainId)?.symbol ?? ''
  const offeredFrom = 'Index - Exchange Issuance'
  return [
    {
      title: getReceivedAmount(isBuying, buyToken, sellToken),
      values: [exactSetAmountFormatted],
    },
    {
      title: getTransactionAmount(isBuying, buyToken, sellToken),
      values: [maxPaymentFormatted],
    },
    { title: 'Network Fee', values: [`${networkFeeDisplay} ${networkToken}`] },
    navData ?? { title: 'NavData', values: [''] },
    { title: 'Offered From', values: [offeredFrom] },
  ]
}

const getTransactionAmount = (
  isBuying: boolean,
  buyToken: Token,
  sellToken: Token
) => {
  if (isBuying) return 'Maximum ' + sellToken.symbol + ' Payment'
  return 'Minimum ' + buyToken.symbol + ' Received'
}

const getReceivedAmount = (
  isBuying: boolean,
  buyToken: Token,
  sellToken: Token
) => {
  if (isBuying) return 'Exact ' + buyToken.symbol + ' Received'
  return 'Exact ' + sellToken.symbol + ' Paid'
}

export function getTradeInfoData0x(
  buyToken: Token,
  gasCosts: BigNumber,
  minOutput: BigNumber,
  sources: { name: string; proportion: string }[],
  chainId: number = 1,
  navData: TradeInfoItem | null = null
): TradeInfoItem[] {
  const minReceive =
    displayFromWei(minOutput, 4) + ' ' + buyToken.symbol ?? '0.0'
  const minReceiveFormatted = formatIfNumber(minReceive)

  const networkFee = displayFromWei(gasCosts)
  const networkFeeDisplay = networkFee ? parseFloat(networkFee).toFixed(4) : '-'
  const networkToken = getNativeToken(chainId)?.symbol ?? ''

  const offeredFromSources = sources
    .filter((source) => Number(source.proportion) > 0)
    .map((source) => source.name)

  return [
    {
      title: 'Minimum ' + buyToken.symbol + ' Received',
      values: [minReceiveFormatted],
    },
    { title: 'Network Fee', values: [`${networkFeeDisplay} ${networkToken}`] },
    navData ?? { title: 'NAV', values: [] },
    { title: 'Offered From', values: offeredFromSources },
  ]
}
