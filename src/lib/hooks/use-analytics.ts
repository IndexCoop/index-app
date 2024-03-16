import { useArcxAnalytics } from '@arcxmoney/analytics'
import { useGTMDispatch } from '@elgorditosalsero/react-gtm-hook'
import { useCallback } from 'react'

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'index-app-prod'

export const useAnalytics = () => {
  const arcxSdk = useArcxAnalytics()
  const sendDataToGTM = useGTMDispatch()

  const logEvent = useCallback(
    (name: string, data?: Record<string, unknown>) => {
      if (!isProduction) return

      arcxSdk?.event(name, data)
      sendDataToGTM({ event: name, ...data })
      window.safary?.track({
        eventType: 'Generic',
        eventName: name,
        parameters: data
      })
    },
    [arcxSdk, sendDataToGTM]
  )

  const logTransaction = useCallback(
    (chainId: number, transactionType: string, transactionHash?: string) => {
      if (!isProduction) return

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
    },
    [arcxSdk, sendDataToGTM]
  )

  const logConnectWallet = useCallback(
    (address?: string, chainId?: number) => {
      if (!isProduction) return

      if (address && chainId) {
        arcxSdk?.wallet({
          account: address ?? '',
          chainId: chainId ?? '',
        })
        sendDataToGTM({ event: 'Connected Wallet', address, chainId })
      }
    },
    [arcxSdk, sendDataToGTM]
  )

  return {
    logConnectWallet,
    logEvent,
    logTransaction,
  }
}
