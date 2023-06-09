import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

export enum CaptureExchangeIssuanceKey {
  leveraged = 'leveraged',
  notional = 'notional',
  perp = 'perp',
  wrapped = 'wrapped',
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

export const captureTransaction = (request: CaptureTradeRequest) => {
  Sentry.captureException(`flashmint.${request.exchangeIssuance}`, {
    extra: request,
  })
}

export const initSentryEventTracking = () => {
  Sentry.init({
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV,
    dsn: 'https://a1f6cd2b7ce842b2a471a6c49def712e@o1145781.ingest.sentry.io/6213525',
    integrations: [new BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}
