'use client'

import { useArcxAnalytics } from '@arcxmoney/analytics'
import { useGTMDispatch } from '@elgorditosalsero/react-gtm-hook'
import { useCallback } from 'react'

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'index-app-prod'

export const useAnalytics = () => {
  const arcxSdk = useArcxAnalytics()
  const sendDataToGTM = useGTMDispatch()

  const logEvent = useCallback(
    (name: string, data?: { [key: string]: string | number | boolean }) => {
      if (!isProduction) return

      try {
        arcxSdk?.event(name, data)
        sendDataToGTM({ event: name, ...data })
        window.safary?.track({
          eventType: 'Generic',
          eventName: name,
          parameters: data,
        })
      } catch (e) {
        console.log('Caught error in logEvent', e)
      }
    },
    [arcxSdk, sendDataToGTM],
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
        sendDataToGTM({
          event: 'Transaction Submitted',
          chainId,
          transactionHash: transactionHash ?? '',
        })
        window.safary?.track({
          eventType: 'Transaction',
          eventName: 'Submitted',
          parameters: {
            transactionHash: transactionHash ?? '',
          },
        })
      } catch (e) {
        console.log('Caught error in logTransaction', e)
      }
    },
    [arcxSdk, sendDataToGTM],
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
          sendDataToGTM({ event: 'Wallet Connected', address, chainId })
          window.safary?.track({
            eventType: 'Wallet',
            eventName: 'Connected',
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
    [arcxSdk, sendDataToGTM],
  )

  return {
    logConnectWallet,
    logEvent,
    logTransaction,
  }
}
