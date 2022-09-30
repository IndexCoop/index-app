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
  Sentry.captureException(`dashboard_tab.${id}`)
}

export const captureTransaction = (request: CaptureTradeRequest) => {
  Sentry.captureException(`exchangeIssuanceTrade.${request.exchangeIssuance}`, {
    extra: request,
  })
}
