import React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import theme from 'theme'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { Config, DAppProvider, Mainnet } from '@usedapp/core'

import DPI from 'components/views/DPI'
import { MarketDataProvider } from 'contexts/MarketData/MarketDataProvider'

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import App from './App'

import './index.css'

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: process.env.REACT_APP_MAINNET_INFURA_API ?? '',
  },
}

const Providers = (props: { children: any }) => {
  return (
    <ChakraProvider theme={theme}>
      <DAppProvider config={config}>
        <MarketDataProvider>{props.children}</MarketDataProvider>
      </DAppProvider>
    </ChakraProvider>
  )
}

Sentry.init({
  dsn: "https://c0ccb3dd6abf4178b3894c7f834da09d@o1122170.ingest.sentry.io/6159535",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/dpi' element={<DPI />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  </React.StrictMode>,
  document.getElementById('root')
)
