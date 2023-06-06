import { useMemo } from 'react'
import { useRouter } from 'next/router'

import React from 'react'

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { GlobalFonts } from '../../lib/styles/fonts'
import theme, { rainbowkitTheme } from '../../lib/styles/theme'
import { WagmiConfig } from 'wagmi'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { GTMProvider } from '@elgorditosalsero/react-gtm-hook'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

import { BalanceProvider } from '../../lib/providers/Balances'
import { MarketDataProvider } from '../../lib/providers/MarketData'
import { ProtectionProvider } from '../../lib/providers/Protection'
import { initSentryEventTracking } from '../../lib/utils/api/sentry'
import { chains, wagmiClient } from '../../lib/utils/wagmi'

export default function Page() {
  const router = useRouter()
  console.log(router.query.path, 'path')

  return (
    <Providers>
      <GlobalFonts />
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <h1>hello</h1>
    </Providers>
  )
}

const Providers = (props: { children: any }) => {
  const gtmParams = {
    id: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID ?? '',
  }

  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={rainbowkitTheme}
          appInfo={{
            appName: 'Index Coop',
            learnMoreUrl: 'https://indexcoop.com',
          }}
        >
          <MarketDataProvider>
            <BalanceProvider>
              <ProtectionProvider>
                <GTMProvider state={gtmParams}>{props.children}</GTMProvider>
              </ProtectionProvider>
            </BalanceProvider>
          </MarketDataProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  )
}

// TODO:
// initSentryEventTracking()
// const container = document.getElementById('root')
// const root = createRoot(container!)
// root.render(
// )
