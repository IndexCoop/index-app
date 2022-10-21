import * as Sentry from '@sentry/react'

export enum CaptureExchangeIssuanceKey {
  leveraged = 'leveraged',
  perp = 'perp',
  zeroEx = 'zeroEx',
}

export enum CaptureExchangeIssuanceFunctionKey {
  issueEth = 'issueEth',
  issueErc20 = 'issueErc20',
  redeemEth = 'redeemEth',
  redeemErc20 = 'redeemErc20',
}

type CaptureTradeRequest = {
  exchangeIssuance: CaptureExchangeIssuanceKey
  function: CaptureExchangeIssuanceFunctionKey
  setToken: string
  setAmount: string
  gasLimit: string
  slippage: string
}

export const captureDashboardSelection = (id: number) => {
  const tab = id === 1 ? 'history' : 'balances'
  Sentry.captureException(`dashboard_tab.${tab}`)
}

export const captureTransaction = (request: CaptureTradeRequest) => {
  Sentry.captureException(`exchangeIssuanceTrade.${request.exchangeIssuance}`, {
    extra: request,
  })
}

export const captureTxData = (
  chainId: number,
  transactionType: string,
  transactionHash: string,
  data: any = {}
) => {
  Sentry.captureException('arcx', {
    extra: {
      chainId,
      transactionType,
      transactionHash,
      data,
    },
  })
}
