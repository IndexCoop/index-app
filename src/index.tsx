import React from 'react'

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from 'App'
import { GlobalFonts } from 'styles/fonts'
import theme, { rainbowkitTheme } from 'styles/theme'
import { WagmiConfig } from 'wagmi'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { GTMProvider } from '@elgorditosalsero/react-gtm-hook'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

import { BalanceProvider } from 'providers/Balances'
import { MarketDataProvider } from 'providers/MarketData'
import { ProtectionProvider } from 'providers/Protection'
import { initSentryEventTracking } from 'utils/api/sentry'
import { chains, wagmiClient } from 'utils/wagmi'
import Homepage from 'views/Homepage'

import '@rainbow-me/rainbowkit/styles.css'

window.Buffer = window.Buffer || require('buffer').Buffer

const Providers = (props: { children: any }) => {
  const gtmParams = {
    id: process.env.REACT_APP_GOOGLE_TAG_MANAGER_CONTAINER_ID ?? '',
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

initSentryEventTracking()
const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <GlobalFonts />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Homepage />} />
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
)
