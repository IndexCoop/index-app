import * as Sentry from '@sentry/react'

export enum CaptureExchangeIssuanceKey {
  'leveraged',
  'zeroEx',
}

export enum CaptureExchangeIssuanceFunctionKey {
  'issueEth',
  'issueErc20',
  'redeemEth',
  'redeemErc20',
}

type CaptureTradeRequest = {
  exchangeIssuance: CaptureExchangeIssuanceKey
  function: CaptureExchangeIssuanceFunctionKey
  setToken: string
  setAmount: string
  gasLimit: string
}

export const captureTransaction = (request: CaptureTradeRequest) => {
  Sentry.captureException('exchangeIssuanceTrade', {
    extra: request,
  })
}
