'use client'

import { useArcxAnalytics } from '@arcxmoney/analytics'
import ReactGA from "react-ga4";
import { useCallback } from 'react'

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'index-app-prod'

export const useAnalytics = () => {
  const arcxSdk = useArcxAnalytics()

  const logEvent = useCallback(
    (name: string, data?: { [key: string]: string | number | boolean }) => {
      if (!isProduction) return

      try {
        arcxSdk?.event(name, data)
        ReactGA.event(name, data)
        window.safary?.track({
          eventType: 'Generic',
          eventName: name,
          parameters: data,
        })
      } catch (e) {
        console.log('Caught error in logEvent', e)
      }
    },
    [arcxSdk],
  )

  const logTransaction = useCallback(
    (chainId: number, transactionType: string, transactionHash?: string) => {
      if (!isProduction) return

      try {
        arcxSdk?.transaction({
          chainId,
          transactionHash: transactionHash ?? '',
          metadata: {
            transactionType,
          },
        })
        ReactGA.event('Transaction Submitted', {
          chainId,
          transactionHash: transactionHash ?? '',
        })
        window.safary?.track({
          eventType: 'Transaction',
          eventName: 'Transaction Submitted',
          parameters: {
            transactionHash: transactionHash ?? '',
          },
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
