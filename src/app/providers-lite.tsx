'use client'

import { WagmiProvider } from 'wagmi'

import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import { rainbowkitTheme } from '@/lib/styles/theme'
import { wagmiConfig } from '@/lib/utils/wagmi'

import '@rainbow-me/rainbowkit/styles.css'
import '@/lib/styles/fonts'
import { AnalyticsProvider } from './analytics-provider'

const queryClient = new QueryClient()

const rainbowKitAppInfo = {
  appName: 'Index Coop',
  learnMoreUrl: 'https://indexcoop.com',
}

// All providers except Chakra
export function ProvidersLite({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowkitTheme} appInfo={rainbowKitAppInfo}>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
