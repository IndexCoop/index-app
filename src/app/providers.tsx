'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { useInitialize } from '@/lib/hooks/use-initialize'
import { ProtectionProvider } from '@/lib/providers/protection'
import theme from '@/lib/styles/theme'
import { initAppkit, wagmiAdapter } from '@/lib/utils/wagmi'

import '@/lib/styles/fonts'
import { AnalyticsProvider } from './analytics-provider'

const queryClient = new QueryClient()

initAppkit()

export function Providers({ children }: { children: React.ReactNode }) {
  useInitialize()

  return (
    <CacheProvider prepend={true}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <AnalyticsProvider>
              <ProtectionProvider>{children}</ProtectionProvider>
            </AnalyticsProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
