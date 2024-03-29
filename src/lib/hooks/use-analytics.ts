'use client'

import { useArcxAnalytics } from '@arcxmoney/analytics'
import ReactGA from 'react-ga4'
import { useCallback } from 'react'
import { Quote } from './use-best-quote/types'

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'index-app-prod'

export const formatQuoteAnalytics = (quote: Quote | null) => {
  if (quote === null) return {}
  return {
    type: quote.type.toString(),
    contract: quote.contract,
    inputToken: quote.inputToken.symbol,
    outputToken: quote.outputToken.symbol,
    gas: quote.gas.toString(),
    inputTokenAmount: quote.inputTokenAmount.toString(),
    outputTokenAmount: quote.outputTokenAmount.toString(),
    slippage: quote.slippage,
  }
}

export const useAnalytics = () => {
  const arcxSdk = useArcxAnalytics()

  const logEvent = useCallback(
    (name: string, data?: { [key: string]: string | number | boolean | undefined }) => {
      if (!isProduction) return

      try {
        arcxSdk?.event(name, data)
        ReactGA.event(name, data)
        window.safary?.track({
          eventType: 'Generic',
          eventName: name,
          parameters: data as { [key: string]: string | number | boolean },
        })
      } catch (e) {
        console.log('Caught error in logEvent', e)
      }
    },
    [arcxSdk],
  )

  const logTransaction = useCallback(
    (
      chainId: number,
      transactionHash: string,
      metadata: { [key: string]: string | number | boolean | undefined },
    ) => {
      if (!isProduction) return

      try {
        arcxSdk?.transaction({
          chainId,
          transactionHash,
          metadata,
        })
        ReactGA.event('Transaction Submitted', {
          chainId,
          transactionHash,
          ...metadata,
        })
        window.safary?.track({
          eventType: 'Transaction',
          eventName: 'Transaction Submitted',
          parameters: metadata as { [key: string]: string | number | boolean },
        })
      } catch (e) {
        console.log('Caught error in logTransaction', e)
      }
    },
    [arcxSdk],
  )

  const logConnectWallet = useCallback(
    (address?: string, chainId?: number) => {
      if (!isProduction) return

      if (address && chainId) {
        try {
          arcxSdk?.wallet({
            account: address ?? '',
            chainId: chainId ?? '',
          })
          ReactGA.event('Wallet Connected', { address, chainId })
          window.safary?.track({
            eventType: 'Wallet',
            eventName: 'Wallet Connected',
            parameters: {
              account: address ?? '',
              chainId: chainId ?? '',
            },
          })
        } catch (e) {
          console.log('Caught error in logConnectWallet', e)
        }
      }
    },
    [arcxSdk],
  )

  return {
    logConnectWallet,
    logEvent,
    logTransaction,
  }
}
