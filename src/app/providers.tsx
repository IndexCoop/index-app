'use client'

import { WagmiConfig } from 'wagmi'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

import theme, { rainbowkitTheme } from '@/lib/styles/theme'
import { chains, wagmiConfig } from '@/lib/utils/wagmi'

import '@rainbow-me/rainbowkit/styles.css'
import '@/lib/styles/fonts'
import { AnalyticsProvider } from './analytics-provider'

const rainbowKitAppInfo = {
  appName: 'Index Coop',
  learnMoreUrl: 'https://indexcoop.com',
}


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider prepend={true}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            theme={rainbowkitTheme}
            appInfo={rainbowKitAppInfo}
          >
            <AnalyticsProvider>
              {children}
            </AnalyticsProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </CacheProvider>
  )
}
