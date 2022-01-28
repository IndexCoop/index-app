import React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import theme from 'theme'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
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
  return (
    <ChakraProvider theme={theme}>
      <DAppProvider config={config}>
        <MarketDataProvider>
          <SetComponentsProvider>{props.children}</SetComponentsProvider>
        </MarketDataProvider>
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
          <Route path='/products' element={<Products />} />
          <Route path='/dpi' element={<DPI />} />
          <Route path='/mvi' element={<MVI />} />
          <Route path='/eth2x-fli' element={<ETH2xFLI />} />
          <Route path='/eth2x-fli-p' element={<ETH2xFLIP />} />
          <Route path='/btc2x-fli' element={<BTC2xFLI />} />
          <Route path='/bed' element={<BED />} />
          <Route path='/data' element={<DATA />} />
          <Route path='/gmi' element={<GMI />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  </React.StrictMode>,
  document.getElementById('root')
)
