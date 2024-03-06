'use client'

import { WagmiConfig } from 'wagmi'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { GTMProvider } from '@elgorditosalsero/react-gtm-hook'
import { ArcxAnalyticsProvider } from '@arcxmoney/analytics'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

import theme, { rainbowkitTheme } from '@/lib/styles/theme'
import { chains, wagmiConfig } from '@/lib/utils/wagmi'

import '@rainbow-me/rainbowkit/styles.css'
import '@/lib/styles/fonts'

const rainbowKitAppInfo = {
  appName: 'Index Coop',
  learnMoreUrl: 'https://indexcoop.com',
}

const arcxApiKey = process.env.NEXT_PUBLIC_ARCX_ANALYTICS_API_KEY ?? ''

export function Providers({ children }: { children: React.ReactNode }) {
  const gtmParams = {
    id: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID ?? '',
  }
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
            <ArcxAnalyticsProvider apiKey={arcxApiKey}>
              <GTMProvider state={gtmParams}>{children}</GTMProvider>
            </ArcxAnalyticsProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </CacheProvider>
  )
}
