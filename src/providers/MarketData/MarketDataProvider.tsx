import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  Bitcoin2xFLIP,
  DataIndex,
  DefiPulseIndex,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  GmiIndex,
  IBitcoinFLIP,
  icETHIndex,
  IEthereumFLIP,
  IMaticFLIP,
  IndexToken,
  Matic2xFLIP,
  MetaverseIndex,
} from 'constants/tokens'
import { fetchHistoricalTokenMarketData } from 'utils/coingeckoApi'

export interface TokenMarketDataValues {
  prices?: number[][]
  hourlyPrices?: number[][]
  marketcaps?: number[][]
  volumes?: number[][]
}

export interface TokenContext {
  index?: TokenMarketDataValues
  dpi?: TokenMarketDataValues
  mvi?: TokenMarketDataValues
  bed?: TokenMarketDataValues
  data?: TokenMarketDataValues
  ethfli?: TokenMarketDataValues
  btcfli?: TokenMarketDataValues
  ethflip?: TokenMarketDataValues
  gmi?: TokenMarketDataValues
  maticflip?: TokenMarketDataValues
  imaticflip?: TokenMarketDataValues
  iethflip?: TokenMarketDataValues
  btcflip?: TokenMarketDataValues
  ibtcflip?: TokenMarketDataValues
  iceth?: TokenMarketDataValues
  selectLatestMarketData: (...args: any) => number
}

export type TokenContextKeys = keyof TokenContext

export const MarketDataContext = createContext<TokenContext>({
  selectLatestMarketData: () => 0,
})

export const useMarketData = () => useContext(MarketDataContext)

export const MarketDataProvider = (props: { children: any }) => {
  const [indexMarketData, setIndexMarketData] = useState<any>({})
  const [dpiMarketData, setDpiMarketData] = useState<any>({})
  const [mviMarketData, setMviMarketData] = useState<any>({})
  const [bedMarketData, setBedMarketData] = useState<any>({})
  const [dataMarketData, setDataMarketData] = useState<any>({})
  const [ethFliMarketData, setEthFliMarketData] = useState<any>({})
  const [btcFliMarketData, setBtcFliMarketData] = useState<any>({})
  const [ethFlipMarketData, setEthFlipMarketData] = useState<any>({})
  const [iEthFliPMarketData, setIEthFliPMarketData] = useState<any>({})
  const [gmiMarketData, setGmiMarketData] = useState<any>({})
  const [maticFliPMarketData, setMaticFliPMarketData] = useState<any>({})
  const [iMaticFliPMarketData, setIMaticFliPMarketData] = useState<any>({})
  const [btcFliPMarketData, setBtcFliPMarketData] = useState<any>({})
  const [iBtcFliPMarketData, setIBtcFliPMarketData] = useState<any>({})
  const [icEthMarketData, setIcEthMarketData] = useState<any>({})

  const selectLatestMarketData = (marketData?: number[][]) =>
    marketData?.[marketData.length - 1]?.[1] || 0

  const fetchMarketData = useCallback(async () => {
    const marketData = await Promise.all([
      fetchHistoricalTokenMarketData(IndexToken.coingeckoId),
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
      fetchHistoricalTokenMarketData(GmiIndex.coingeckoId),
      fetchHistoricalTokenMarketData(IEthereumFLIP.coingeckoId),
      fetchHistoricalTokenMarketData(Matic2xFLIP.coingeckoId),
      fetchHistoricalTokenMarketData(IMaticFLIP.coingeckoId),
      fetchHistoricalTokenMarketData(Bitcoin2xFLIP.coingeckoId),
      fetchHistoricalTokenMarketData(IBitcoinFLIP.coingeckoId),
      fetchHistoricalTokenMarketData(icETHIndex.coingeckoId),
    ])

    setIndexMarketData(marketData[0])
    setDpiMarketData(marketData[1])
    setMviMarketData(marketData[2])
    setBedMarketData(marketData[3])
    setDataMarketData(marketData[4])
    setEthFliMarketData(marketData[5])
    setBtcFliMarketData(marketData[6])
    setEthFlipMarketData(marketData[7])
    setGmiMarketData(marketData[8])
    setIEthFliPMarketData(marketData[9])
    setMaticFliPMarketData(marketData[10])
    setIMaticFliPMarketData(marketData[11])
    setBtcFliPMarketData(marketData[12])
    setIBtcFliPMarketData(marketData[13])
    setIcEthMarketData(marketData[14])
  }, [])

  useEffect(() => {
    fetchMarketData()
  }, [fetchMarketData])

  return (
    <MarketDataContext.Provider
      value={{
        selectLatestMarketData,
        index: indexMarketData,
        dpi: dpiMarketData,
        mvi: mviMarketData,
        bed: bedMarketData,
        data: dataMarketData,
        ethfli: ethFliMarketData,
        btcfli: btcFliMarketData,
        ethflip: ethFlipMarketData,
        gmi: gmiMarketData,
        maticflip: maticFliPMarketData,
        imaticflip: iMaticFliPMarketData,
        iethflip: iEthFliPMarketData,
        btcflip: btcFliPMarketData,
        ibtcflip: iBtcFliPMarketData,
        iceth: icEthMarketData,
      }}
    >
      {props.children}
    </MarketDataContext.Provider>
  )
}
