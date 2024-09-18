'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { wagmiConfig } from '@/lib/utils/wagmi'

import '@/lib/styles/fonts'
import '@rainbow-me/rainbowkit/styles.css'
import { AnalyticsProvider } from './analytics-provider'

const queryClient = new QueryClient()

// All providers except Chakra
export function ProvidersLite({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
