import React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter, Route,Routes } from 'react-router-dom'

import theme from 'theme'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { Config, DAppProvider, Mainnet } from '@usedapp/core'

import { MarketDataProvider } from 'contexts/MarketData/MarketDataProvider'

import App from './App'

import './index.css'

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]:
      'https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934',
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

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  </React.StrictMode>,
  document.getElementById('root')
)
