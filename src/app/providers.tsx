'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { useInitialize } from '@/lib/hooks/use-initialize'
import { ProtectionProvider } from '@/lib/providers/protection'
import { initAppkit, wagmiAdapter } from '@/lib/utils/wagmi'

import '@/lib/styles/fonts'
import { AnalyticsProvider } from './analytics-provider'

const queryClient = new QueryClient()

initAppkit()

function InitializeWrapper({ children }: { children: React.ReactNode }) {
  useInitialize()
  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AnalyticsProvider>
          <ProtectionProvider>
            <InitializeWrapper>{children}</InitializeWrapper>
          </ProtectionProvider>
        </AnalyticsProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
