import { colors } from 'styles/colors'

import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '@usedapp/core'

import { Token } from 'constants/tokens'
import { displayFromWei } from 'utils'
import {
  ExchangeIssuanceQuote,
  LeveragedExchangeIssuanceQuote,
} from 'utils/exchangeIssuanceQuotes'
import { ZeroExData } from 'utils/zeroExUtils'

import { TradeInfoItem } from './TradeInfo'

export function getPriceImpaceColorCoding(
  priceImpact: number,
  isDarkMode: boolean
): string {
  if (priceImpact < -5) {
    return colors.icRed
  }

  if (priceImpact < -3) {
    return colors.icYellow
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
      displayFromWei(
        exchangeIssuanceOutputAmount,
        undefined,
        ouputTokenDecimals
      ) ?? '0.0'
    )
  }

  return displayFromWei(zeroExTradeDataOutputAmount) ?? '0.0'
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

  const colorCoding = getPriceImpaceColorCoding(priceImpact, isDarkMode)
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

export function getTradeInfoDataFromEI(
  setAmount: BigNumber,
  gasPrice: BigNumber,
  buyToken: Token,
  sellToken: Token,
  data:
    | ExchangeIssuanceQuote
    | LeveragedExchangeIssuanceQuote
    | null
    | undefined,
  chainId: ChainId = ChainId.Mainnet,
  isBuying: boolean
): TradeInfoItem[] {
  if (data === undefined || data === null) return []
  const exactSetAmount = displayFromWei(setAmount) ?? '0.0'
  const inputTokenMax = data.inputTokenAmount
  const maxPayment = displayFromWei(inputTokenMax) ?? '0.0'
  const gasLimit = 1800000 // TODO: Make gasLimit dynamic
  const networkFee = displayFromWei(gasPrice.mul(gasLimit))
  const networkFeeDisplay = networkFee ? parseFloat(networkFee).toFixed(4) : '-'
  const networkToken = chainId === ChainId.Polygon ? 'MATIC' : 'ETH'
  const offeredFrom = 'Index - Exchange Issuance'
  return [
    {
      title: getReceivedAmount(isBuying, buyToken, sellToken),
      value: exactSetAmount,
    },
    {
      title: getTransactionAmount(isBuying, buyToken, sellToken),
      value: maxPayment,
    },
    { title: 'Network Fee', value: `${networkFeeDisplay} ${networkToken}` },
    { title: 'Offered From', value: offeredFrom },
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
  zeroExTradeData: ZeroExData | undefined | null,
  buyToken: Token,
  chainId: ChainId = ChainId.Mainnet
): TradeInfoItem[] {
  if (zeroExTradeData === undefined || zeroExTradeData === null) return []

  const { gas, gasPrice, sources } = zeroExTradeData
  if (gasPrice === undefined || gas === undefined || sources === undefined)
    return []

  const buyAmount =
    displayFromWei(
      BigNumber.from(zeroExTradeData.buyAmount),
      undefined,
      buyToken.decimals
    ) ?? '0.0'

  const minReceive =
    displayFromWei(zeroExTradeData.minOutput) + ' ' + buyToken.symbol ?? '0.0'

  const networkFee = displayFromWei(
    BigNumber.from(gasPrice).mul(BigNumber.from(gas))
  )
  const networkFeeDisplay = networkFee ? parseFloat(networkFee).toFixed(4) : '-'
  const networkToken = chainId === ChainId.Polygon ? 'MATIC' : 'ETH'

  const offeredFromSources = zeroExTradeData.sources
    .filter((source) => Number(source.proportion) > 0)
    .map((source) => source.name)

  return [
    { title: 'Buy Amount', value: buyAmount },
    { title: 'Minimum ' + buyToken.symbol + ' Received', value: minReceive },
    { title: 'Network Fee', value: `${networkFeeDisplay} ${networkToken}` },
    { title: 'Offered From', value: offeredFromSources.toString() },
  ]
}
