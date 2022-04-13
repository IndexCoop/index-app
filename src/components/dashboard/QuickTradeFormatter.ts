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
  tokenDecimals: number,
  chainId: ChainId = ChainId.Mainnet,
  isBuying: boolean
): TradeInfoItem[] {
  if (data === undefined || data === null) return []
  const exactSetAmount = displayFromWei(setAmount) ?? '0.0'

  // TODO: connect this amount to the value from
  // useExchangeIssuanceLeveraged: issueExactSetFromETH()
  const inputTokenMax = data.inputTokenAmount.mul(10050).div(10000)
  const maxPayment =
    displayFromWei(inputTokenMax, undefined, tokenDecimals) ?? '0.0'
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
  tokenDecimals: number,
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
      tokenDecimals
    ) ?? '0.0'

  const minReceive =
    displayFromWei(zeroExTradeData.minOutput, undefined, tokenDecimals) ?? '0.0'

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
