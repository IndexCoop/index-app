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

export function formattedBalance(
  token: Token,
  tokenBalance: BigNumber | undefined
) {
  const zero = '0.00'
  return tokenBalance
    ? displayFromWei(tokenBalance, 2, token.decimals) || zero
    : zero
}

export function getTradeInfoDataFromEI(
  setAmount: BigNumber,
  gasPrice: BigNumber,
  buyToken: Token,
  data:
    | ExchangeIssuanceQuote
    | LeveragedExchangeIssuanceQuote
    | null
    | undefined,
  tokenDecimals: number,
  chainId: ChainId = ChainId.Mainnet
): TradeInfoItem[] {
  if (data === undefined || data === null) return []
  console.log('data', data)
  const exactSetAmount =
    displayFromWei(setAmount) + ' ' + buyToken.symbol ?? '0.0'
  const maxPayment =
    displayFromWei(data.inputTokenAmount, undefined, tokenDecimals) ?? '0.0'
  const gasLimit = 1800000 // TODO: Make gasLimit dynamic
  const networkFee = displayFromWei(gasPrice.mul(gasLimit))
  const networkFeeDisplay = networkFee ? parseFloat(networkFee).toFixed(4) : '-'
  const networkToken = chainId === ChainId.Polygon ? 'MATIC' : 'ETH'
  const offeredFrom = 'Index - Exchange Issuance'
  return [
    { title: `Exact Amount of Received`, value: exactSetAmount },
    { title: 'Maximum Payment Amount', value: maxPayment },
    { title: 'Network Fee', value: `${networkFeeDisplay} ${networkToken}` },
    { title: 'Offered From', value: offeredFrom },
  ]
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
    displayFromWei(zeroExTradeData.minOutput, undefined, tokenDecimals) +
      ' ' +
      buyToken.symbol ?? '0.0'

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
    { title: 'Minimum Received', value: minReceive },
    { title: 'Network Fee', value: `${networkFeeDisplay} ${networkToken}` },
    { title: 'Offered From', value: offeredFromSources.toString() },
  ]
}
