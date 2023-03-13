import React from 'react'

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from 'App'
import { GlobalFonts } from 'styles/fonts'
import theme, { rainbowkitTheme } from 'styles/theme'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { GTMProvider } from '@elgorditosalsero/react-gtm-hook'
import {
  connectorsForWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

import { AlchemyApiKey } from 'constants/server'
import { BalanceProvider } from 'providers/Balances'
import { MarketDataProvider } from 'providers/MarketData'
import { ProtectionProvider } from 'providers/Protection'
import { initSentryEventTracking } from 'utils/api/sentry'
import Homepage from 'views/Homepage'
import BED from 'views/productpages/BED'
import BTC2xFLI from 'views/productpages/BTC2xFLI'
import DPI from 'views/productpages/DPI'
import DSETH from 'views/productpages/DSETH'
import ETH2xFLI from 'views/productpages/ETH2xFLI'
import GTCETH from 'views/productpages/GTCETH'
import ICETH from 'views/productpages/ICETH'
import INDEX from 'views/productpages/INDEX'
import MVI from 'views/productpages/MVI'
import Products from 'views/Products'

import '@rainbow-me/rainbowkit/styles.css'

window.Buffer = window.Buffer || require('buffer').Buffer

const { chains, provider } = configureChains(
  [mainnet, polygon],
  [alchemyProvider({ apiKey: AlchemyApiKey }), publicProvider()]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ chains }),
      rainbowWallet({ chains }),
      argentWallet({ chains }),
      coinbaseWallet({
        appName: 'Index Coop',
        chains,
      }),
      ledgerWallet({ chains }),
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      walletConnectWallet({ chains }),
      braveWallet({ chains }),
      trustWallet({ chains }),
    ],
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

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
            <Route path='products' element={<Products />} />
            <Route path='dpi' element={<DPI />} />
            <Route path='dseth' element={<DSETH />} />
            <Route path='gtceth' element={<GTCETH />} />
            <Route path='mvi' element={<MVI />} />
            <Route path='ethfli' element={<ETH2xFLI />} />
            <Route path='btcfli' element={<BTC2xFLI />} />
            <Route path='bed' element={<BED />} />
            <Route path='iceth' element={<ICETH />} />
            <Route path='index' element={<INDEX />} />
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
)
