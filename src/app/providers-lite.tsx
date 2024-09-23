'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { config } from '@/lib/utils/wagmi'

import '@/lib/styles/fonts'
import { AnalyticsProvider } from './analytics-provider'

const queryClient = new QueryClient()

// All providers except Chakra
export function ProvidersLite({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
