import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useEthers } from '@usedapp/core'

import { MAINNET } from 'constants/chains'
import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DataIndex,
  DefiPulseIndex,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  MetaverseIndex,
} from 'constants/productTokens'
import { fetchHistoricalTokenMarketData } from 'utils/coingeckoApi'

interface TokenMarketDataValues {
  prices?: number[][]
  hourlyPrices?: number[][]
  marketcaps?: number[][]
  volumes?: number[][]
}

interface TokenContext {
  dpi?: TokenMarketDataValues
  mvi?: TokenMarketDataValues
  bed?: TokenMarketDataValues
  data?: TokenMarketDataValues
  ethfli?: TokenMarketDataValues
  btcfli?: TokenMarketDataValues
  ethflip?: TokenMarketDataValues
  selectLatestMarketData: (...args: any) => number
}

export const MarketDataContext = createContext<TokenContext>({
  selectLatestMarketData: () => 0,
})

export const useMarketData = () => useContext(MarketDataContext)

export const MarketDataProvider = (props: { children: any }) => {
  const { chainId } = useEthers()
  const [dpiMarketData, setDpiMarketData] = useState<any>({})
  const [mviMarketData, setMviMarketData] = useState<any>({})
  const [bedMarketData, setBedMarketData] = useState<any>({})
  const [dataMarketData, setDataMarketData] = useState<any>({})
  const [ethFliMarketData, setEthFliMarketData] = useState<any>({})
  const [btcFliMarketData, setBtcFliMarketData] = useState<any>({})
  const [ethFlipMarketData, setEthFlipMarketData] = useState<any>({})

  const selectLatestMarketData = (marketData?: number[][]) =>
    marketData?.[marketData.length - 1]?.[1] || 0

  const fetchMarketData = useCallback(async () => {
    if (chainId === MAINNET.chainId) {
      const marketData = await Promise.all([
        fetchHistoricalTokenMarketData(DefiPulseIndex.coingeckoId),
        fetchHistoricalTokenMarketData(MetaverseIndex.coingeckoId),
        fetchHistoricalTokenMarketData(BedIndex.coingeckoId),
        fetchHistoricalTokenMarketData(DataIndex.coingeckoId),
        fetchHistoricalTokenMarketData(
          Ethereum2xFlexibleLeverageIndex.coingeckoId
        ),
        fetchHistoricalTokenMarketData(
          Bitcoin2xFlexibleLeverageIndex.coingeckoId
        ),
        fetchHistoricalTokenMarketData(Ethereum2xFLIP.coingeckoId),
      ])

      setDpiMarketData(marketData[0])
      setMviMarketData(marketData[1])
      setBedMarketData(marketData[2])
      setDataMarketData(marketData[3])
      setEthFliMarketData(marketData[4])
      setBtcFliMarketData(marketData[5])
      setEthFlipMarketData(marketData[6])
    }
  }, [chainId])

  useEffect(() => {
    fetchMarketData()
  }, [fetchMarketData])

  return (
    <MarketDataContext.Provider
      value={{
        selectLatestMarketData,
        dpi: dpiMarketData,
        mvi: mviMarketData,
        bed: bedMarketData,
        data: dataMarketData,
        ethfli: ethFliMarketData,
        btcfli: btcFliMarketData,
        ethflip: ethFlipMarketData,
      }}
    >
      {props.children}
    </MarketDataContext.Provider>
  )
}
