import React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from 'App'
import theme from 'theme'

import '@fontsource/ibm-plex-sans'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { GTMProvider } from '@elgorditosalsero/react-gtm-hook'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { Config, DAppProvider } from '@usedapp/core'

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
import MATIC2xFLIP from 'components/views/productpages/MATIC2xFLIP'
import MVI from 'components/views/productpages/MVI'
import Products from 'components/views/Products'
import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import LiquidityMiningProvider from 'providers/LiquidityMining/LiquidityMiningProvider'
import { MarketDataProvider } from 'providers/MarketData/MarketDataProvider'
import SetComponentsProvider from 'providers/SetComponents/SetComponentsProvider'

import './index.css'

const config: Config = {
  readOnlyChainId: MAINNET.chainId,
  readOnlyUrls: {
    [MAINNET.chainId]:
      process.env.REACT_APP_MAINNET_ALCHEMY_API ??
      'https://eth-mainnet.alchemyapi.io/v2/Z3DZk23EsAFNouAbUzuw9Y-TvfW9Bo1S',
    [POLYGON.chainId]:
      process.env.REACT_APP_POLYGON_ALCHEMY_API ??
      'https://polygon-mainnet.g.alchemy.com/v2/r-z7OCwLoHZKz45NCFqlR0G8vgOXAp5t',
    [OPTIMISM.chainId]:
      process.env.REACT_APP_OPTIMISM_ALCHEMY_API ??
      'https://op-mainnet.g.alchemy.com/v2/r-z7OCwLoHZKz45NCFqlR0G8vgOXAp5t',
  },
}

const Providers = (props: { children: any }) => {
  const gtmParams = {
    id: process.env.REACT_APP_GOOGLE_TAG_MANAGER_CONTAINER_ID ?? '',
  }

  return (
    <ChakraProvider theme={theme}>
      <DAppProvider config={config}>
        <MarketDataProvider>
          <LiquidityMiningProvider>
            <SetComponentsProvider>
              <GTMProvider state={gtmParams}>{props.children}</GTMProvider>
            </SetComponentsProvider>
          </LiquidityMiningProvider>
        </MarketDataProvider>
      </DAppProvider>
    </ChakraProvider>
  )
}

const initSentryEventTracking = () => {
  const ENVIRONMENTS = {
    development: 'index-app-development',
    production: 'index-app-prod',
    staging: 'index-app-staging'
  }
  const isStaging = process.env.REACT_APP_SENTRY_ENV
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'
  
  let environment = 'undefined'
  if (isStaging) {
    environment = ENVIRONMENTS.staging
  } else if (isDevelopment) {
    environment = ENVIRONMENTS.development
  } else if (isProduction) {
    environment = ENVIRONMENTS.production
  }
    
  Sentry.init({
    environment,
    dsn: 'https://a1f6cd2b7ce842b2a471a6c49def712e@o1145781.ingest.sentry.io/6213525',
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })  
}
initSentryEventTracking()

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
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
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
