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
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  GmiIndex,
  IBitcoinFLIP,
  icETHIndex,
  IEthereumFLIP,
  IMaticFLIP,
  IndexToken,
  JPGIndex,
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
  eth?: TokenMarketDataValues
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
  jpg?: TokenMarketDataValues
  selectLatestMarketData: (...args: any) => number
}

export type TokenContextKeys = keyof TokenContext

export const MarketDataContext = createContext<TokenContext>({
  selectLatestMarketData: () => 0,
})

export const useMarketData = () => useContext(MarketDataContext)

export const MarketDataProvider = (props: { children: any }) => {
  const [ethMarketData, setEthMarketData] = useState<any>({})
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
  const [jpgMarketData, setJpgMarketData] = useState<any>({})

  const selectLatestMarketData = (marketData?: number[][]) =>
    marketData?.[marketData.length - 1]?.[1] || 0

  const fetchMarketData = useCallback(async () => {
    const marketData = await Promise.all([
      fetchHistoricalTokenMarketData(ETH.coingeckoId),
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
      fetchHistoricalTokenMarketData(JPGIndex.coingeckoId),
    ])

    setEthMarketData(marketData[0])
    setIndexMarketData(marketData[1])
    setDpiMarketData(marketData[2])
    setMviMarketData(marketData[3])
    setBedMarketData(marketData[4])
    setDataMarketData(marketData[5])
    setEthFliMarketData(marketData[6])
    setBtcFliMarketData(marketData[7])
    setEthFlipMarketData(marketData[8])
    setGmiMarketData(marketData[9])
    setIEthFliPMarketData(marketData[10])
    setMaticFliPMarketData(marketData[11])
    setIMaticFliPMarketData(marketData[12])
    setBtcFliPMarketData(marketData[13])
    setIBtcFliPMarketData(marketData[14])
    setIcEthMarketData(marketData[15])
    setJpgMarketData(marketData[16])
  }, [])

  useEffect(() => {
    fetchMarketData()
  }, [fetchMarketData])

  return (
    <MarketDataContext.Provider
      value={{
        selectLatestMarketData,
        eth: ethMarketData,
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
        jpg: jpgMarketData,
      }}
    >
      {props.children}
    </MarketDataContext.Provider>
  )
}
