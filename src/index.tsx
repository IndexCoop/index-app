import React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import App from 'App'
import theme from 'theme'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { Config, DAppProvider, Mainnet } from '@usedapp/core'

import Dashboard from 'components/views/Homepage'
import LiquidityMining from 'components/views/LiquidityMining'
import BED from 'components/views/productpages/BED'
import BTC2xFLI from 'components/views/productpages/BTC2xFLI'
import DATA from 'components/views/productpages/DATA'
import DPI from 'components/views/productpages/DPI'
import ETH2xFLI from 'components/views/productpages/ETH2xFLI'
import ETH2xFLIP from 'components/views/productpages/ETH2xFLIP'
import GMI from 'components/views/productpages/GMI'
import MVI from 'components/views/productpages/MVI'
import Products from 'components/views/Products'
import { MarketDataProvider } from 'contexts/MarketData/MarketDataProvider'
import SetComponentsProvider from 'contexts/SetComponents/SetComponentsProvider'

import './index.css'

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: process.env.REACT_APP_MAINNET_INFURA_API ?? '',
  },
}

const Providers = (props: { children: any }) => {
  return <ChakraProvider theme={theme}>{props.children}</ChakraProvider>
}

// <DAppProvider config={config}>
//   <MarketDataProvider>
//     <SetComponentsProvider>{props.children}</SetComponentsProvider>
//   </MarketDataProvider>
// </DAppProvider>

Sentry.init({
  dsn: 'https://c0ccb3dd6abf4178b3894c7f834da09d@o1122170.ingest.sentry.io/6159535',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

export function App2(props: { text: string }) {
  return (
    <div>
      <h1>INDEX {props.text}</h1>
    </div>
  )
}

// ReactDOM.render(
//   <React.StrictMode>
//     <Router>
//       <Providers>
//         <ColorModeScript initialColorMode={theme.config.initialColorMode} />
//         <Routes>
//           <Route path='/' element={<Dashboard />} />
//         </Routes>
//       </Providers>
//     </Router>
//   </React.StrictMode>,
//   document.getElementById('root')
// )

const rootElement = document.getElementById('root')
ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='test' element={<App2 text={'2'} />} />
        </Routes>
      </Router>
    </Providers>
  </React.StrictMode>,
  rootElement
)
