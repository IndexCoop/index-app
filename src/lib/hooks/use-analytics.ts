'use client'

import { useArcxAnalytics } from '@0xarc-io/analytics'
import { useCallback } from 'react'
import ReactGA from 'react-ga4'
import { useAccount } from 'wagmi'

import { Quote } from './use-best-quote/types'

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'index-app-prod'

export const formatQuoteAnalytics = (quote: Quote | null) => {
  if (quote === null) return {}
  return {
    type: quote.type.toString(),
    inputToken: quote.inputToken.symbol,
    outputToken: quote.outputToken.symbol,
    gas: quote.gas.toString(),
    gasPrice: quote.gasPrice.toString(),
    gasCosts: quote.gasCosts.toString(),
    gasCostsInUsd: quote.gasCostsInUsd,
    inputTokenAmount: quote.inputTokenAmount.toString(),
    inputTokenAmountUsd: quote.inputTokenAmountUsd,
    outputTokenAmount: quote.outputTokenAmount.toString(),
    outputTokenAmountUsd: quote.outputTokenAmountUsd,
    outputTokenAmountUsdAfterFees: quote.outputTokenAmountUsdAfterFees,
    inputTokenPrice: quote.inputTokenPrice,
    outputTokenPrice: quote.outputTokenPrice,
    slippage: quote.slippage,
  }
}

export const useAnalytics = () => {
  const { address: walletAddress } = useAccount()
  const arcxSdk = useArcxAnalytics()

  const logEvent = useCallback(
    (
      name: string,
      data?: { [key: string]: string | number | boolean | undefined },
    ) => {
      if (!isProduction) return

      try {
        const enhancedData = { ...data, walletAddress }
        arcxSdk?.event(name, enhancedData)
        ReactGA.event(name, enhancedData)
        window.safary?.track({
          eventType: 'Generic',
          eventName: name,
          parameters: enhancedData as {
            [key: string]: string | number | boolean
          },
        })
      } catch (e) {
        console.warn('Caught error in logEvent', e)
      }
    },
    [arcxSdk, walletAddress],
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
          metadata: {
            ...metadata,
            walletAddress,
          },
        })
        ReactGA.event('Transaction Submitted', {
          ...metadata,
          chainId,
          transactionHash,
          walletAddress,
        })
        window.safary?.track({
          eventType: 'Transaction',
          eventName: 'Transaction Submitted',
          parameters: { ...metadata, walletAddress } as {
            [key: string]: string | number | boolean
          },
        })
      } catch (e) {
        console.warn('Caught error in logTransaction', e)
      }
    },
    [arcxSdk, walletAddress],
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
          console.warn('Caught error in logConnectWallet', e)
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
