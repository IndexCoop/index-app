import React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import theme from 'theme'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { Config, DAppProvider, Mainnet } from '@usedapp/core'

import Dashboard from 'components/views/Dashboard'
import DPI from 'components/views/DPI'
import LiquidityMining from 'components/views/LiquidityMining'
import { MarketDataProvider } from 'contexts/MarketData/MarketDataProvider'

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

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/lm' element={<LiquidityMining />} />
          <Route path='/dpi' element={<DPI />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  </React.StrictMode>,
  document.getElementById('root')
)
