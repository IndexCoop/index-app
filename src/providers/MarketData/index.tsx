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
  Matic2xFLIP,
  MetaverseIndex,
  MNYeIndex,
  Token,
} from 'constants/tokens'
import { fetchHistoricalTokenMarketData } from 'utils/api/coingeckoApi'

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
  mnye?: TokenMarketDataValues
  selectLatestMarketData: (...args: any) => number
  selectMarketDataByToken: (token: Token) => number[][]
}

export type TokenContextKeys = keyof TokenContext

export const MarketDataContext = createContext<TokenContext>({
  selectLatestMarketData: () => 0,
  selectMarketDataByToken: () => [[]],
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
  const [mnyeMarketData, setMnyeMarketData] = useState<any>({})

  const selectLatestMarketData = (marketData?: number[][]) =>
    marketData?.[marketData.length - 1]?.[1] || 0

  const selectMarketDataByToken = (token: Token) => {
    switch (token) {
      case DefiPulseIndex:
        return dpiMarketData
      case Matic2xFLIP:
        return maticFliPMarketData
      case MetaverseIndex:
        return mviMarketData
      case BedIndex:
        return bedMarketData
      case DataIndex:
        return dataMarketData
      case Ethereum2xFLIP:
        return ethFlipMarketData
      case Ethereum2xFlexibleLeverageIndex:
        return ethFliMarketData
      case Bitcoin2xFLIP:
        return btcFliPMarketData
      case Bitcoin2xFlexibleLeverageIndex:
        return btcFliMarketData
      case GmiIndex:
        return gmiMarketData
      case icETHIndex:
        return icEthMarketData
      case MNYeIndex:
        return mnyeMarketData
      case IEthereumFLIP:
        return iEthFliPMarketData
      case IMaticFLIP:
        return iMaticFliPMarketData
      case IBitcoinFLIP:
        return iBtcFliPMarketData
      default:
        return 0
    }
  }

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
      fetchHistoricalTokenMarketData(MNYeIndex.coingeckoId),
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
    setMnyeMarketData(marketData[16])
  }, [])

  useEffect(() => {
    fetchMarketData()
  }, [fetchMarketData])

  return (
    <MarketDataContext.Provider
      value={{
        selectLatestMarketData,
        selectMarketDataByToken,
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
        mnye: mnyeMarketData,
      }}
    >
      {props.children}
    </MarketDataContext.Provider>
  )
}
