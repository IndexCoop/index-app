import React from 'react'

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from 'App'
import { GlobalFonts } from 'styles/fonts'
import theme, { rainbowkitTheme } from 'styles/theme'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { GTMProvider } from '@elgorditosalsero/react-gtm-hook'
import {
  connectorsForWallets,
  RainbowKitProvider,
  wallet,
} from '@rainbow-me/rainbowkit'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

import Dashboard from 'components/views/Homepage'
import LiquidityMining from 'components/views/LiquidityMining'
import BED from 'components/views/productpages/BED'
import BTC2xFLI from 'components/views/productpages/BTC2xFLI'
import BTC2xFLIP from 'components/views/productpages/BTC2xFLIP'
import DATA from 'components/views/productpages/DATA'
import DPI from 'components/views/productpages/DPI'
import ETH2xFLI from 'components/views/productpages/ETH2xFLI'
import ETH2xFLIP from 'components/views/productpages/ETH2xFLIP'
import GMI from 'components/views/productpages/GMI'
import IBTCFLIP from 'components/views/productpages/IBTCFLIP'
import ICETH from 'components/views/productpages/ICETH'
import IETHFLIP from 'components/views/productpages/IETHFLIP'
import IMATICFLIP from 'components/views/productpages/IMATICFLIP'
import INDEX from 'components/views/productpages/INDEX'
import JPG from 'components/views/productpages/JPG'
import MATIC2xFLIP from 'components/views/productpages/MATIC2xFLIP'
import MNYe from 'components/views/productpages/MNYe'
import MVI from 'components/views/productpages/MVI'
import Products from 'components/views/Products'
import { BalanceProvider } from 'providers/Balances'
import { MarketDataProvider } from 'providers/MarketData'
import { ProtectionProvider } from 'providers/Protection'

import '@rainbow-me/rainbowkit/dist/index.css'

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_ID }),
    publicProvider(),
  ]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      wallet.metaMask({ chains }),
      wallet.rainbow({ chains }),
      wallet.argent({ chains }),
      wallet.coinbase({
        appName: 'Index Coop',
        chains,
      }),
      wallet.ledger({ chains }),
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      wallet.walletConnect({ chains }),
      wallet.brave({ chains }),
      wallet.trust({ chains }),
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

const initSentryEventTracking = () => {
  Sentry.init({
    environment: process.env.REACT_APP_VERCEL_ENV,
    dsn: 'https://a1f6cd2b7ce842b2a471a6c49def712e@o1145781.ingest.sentry.io/6213525',
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
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
            <Route index element={<Dashboard />} />
            <Route path='liquidity-mining' element={<LiquidityMining />} />
            <Route path='products' element={<Products />} />
            <Route path='dpi' element={<DPI />} />
            <Route path='mvi' element={<MVI />} />
            <Route path='ethfli' element={<ETH2xFLI />} />
            <Route path='ethflip' element={<ETH2xFLIP />} />
            <Route path='btcfli' element={<BTC2xFLI />} />
            <Route path='bed' element={<BED />} />
            <Route path='data' element={<DATA />} />
            <Route path='gmi' element={<GMI />} />
            <Route path='ieth' element={<IETHFLIP />} />
            <Route path='matic2x' element={<MATIC2xFLIP />} />
            <Route path='imatic' element={<IMATICFLIP />} />
            <Route path='btc2x' element={<BTC2xFLIP />} />
            <Route path='ibtc' element={<IBTCFLIP />} />
            <Route path='iceth' element={<ICETH />} />
            <Route path='index' element={<INDEX />} />
            <Route path='jpg' element={<JPG />} />
            <Route path='mnye' element={<MNYe />} />
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
)
