'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { SignTermsProvider } from '@/lib/providers/sign-terms-provider'
import theme, { rainbowkitTheme } from '@/lib/styles/theme'
import { wagmiConfig } from '@/lib/utils/wagmi'

import '@/lib/styles/fonts'
import '@rainbow-me/rainbowkit/styles.css'
import { AnalyticsProvider } from './analytics-provider'

const queryClient = new QueryClient()

const rainbowKitAppInfo = {
  appName: 'Index Coop',
  learnMoreUrl: 'https://indexcoop.com',
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider prepend={true}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              theme={rainbowkitTheme}
              appInfo={rainbowKitAppInfo}
            >
              <AnalyticsProvider>
                <SignTermsProvider>{children}</SignTermsProvider>
              </AnalyticsProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
