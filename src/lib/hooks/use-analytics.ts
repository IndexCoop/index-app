import { useArcxAnalytics } from '@arcxmoney/analytics'
import { useGTMDispatch } from '@elgorditosalsero/react-gtm-hook'
import { useCallback } from 'react'

export const useAnalytics = () => {
  const arcxSdk = useArcxAnalytics()
  const sendDataToGTM = useGTMDispatch()

  const logEvent = useCallback(
    (name: string, data?: Record<string, unknown>) => {
      arcxSdk?.event(name, data)
      sendDataToGTM({ event: name, ...data })
    },
    [arcxSdk, sendDataToGTM]
  )

  const logTransaction = useCallback(
    (chainId: number, transactionType: string, transactionHash?: string) => {
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
