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
  DefiPulseIndex,
  DiversifiedStakedETHIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  GitcoinStakedETHIndex,
  icETHIndex,
  IndexToken,
  LeveragedRethStakingYield,
  MetaverseIndex,
  MoneyMarketIndex,
  Token,
} from '../../../constants/tokens'
import { fetchHistoricalTokenMarketData } from '../../../lib/utils/api/coingeckoApi'

export interface TokenMarketDataValues {
  prices?: number[][]
  hourlyPrices?: number[][]
  marketcaps?: number[][]
  volumes?: number[][]
}

export interface TokenContext {
  dseth?: TokenMarketDataValues
  eth?: TokenMarketDataValues
  index?: TokenMarketDataValues
  dpi?: TokenMarketDataValues
  mmi?: TokenMarketDataValues
  mvi?: TokenMarketDataValues
  bed?: TokenMarketDataValues
  ethfli?: TokenMarketDataValues
  btcfli?: TokenMarketDataValues
  iceth?: TokenMarketDataValues
  icreth?: TokenMarketDataValues
  gtceth?: TokenMarketDataValues
  getMarketDataBySymbol: (token: Token) => TokenMarketDataValues | null
  selectLatestMarketData: (...args: any) => number
  selectMarketDataByToken: (token: Token) => number[][]
}

export type TokenContextKeys = keyof TokenContext

export const MarketDataContext = createContext<TokenContext>({
  getMarketDataBySymbol: () => null,
  selectLatestMarketData: () => 0,
  selectMarketDataByToken: () => [[]],
})

export const useMarketData = () => useContext(MarketDataContext)

export const MarketDataProvider = (props: { children: any }) => {
  const [dsEthMarketData, setDsEthMarketData] = useState<any>({})
  const [gtcEthMarketData, setGtcEthMarketData] = useState<any>({})
  const [ethMarketData, setEthMarketData] = useState<any>({})
  const [indexMarketData, setIndexMarketData] = useState<any>({})
  const [dpiMarketData, setDpiMarketData] = useState<any>({})
  const [mviMarketData, setMviMarketData] = useState<any>({})
  const [bedMarketData, setBedMarketData] = useState<any>({})
  const [ethFliMarketData, setEthFliMarketData] = useState<any>({})
  const [btcFliMarketData, setBtcFliMarketData] = useState<any>({})
  const [icEthMarketData, setIcEthMarketData] = useState<any>({})
  const [icRethMarketData, setIcRethMarketData] = useState<any>({})
  const [mmiMarketData, setMmiMarketData] = useState<any>({})

  const selectLatestMarketData = (marketData?: number[][]) =>
    marketData?.[marketData.length - 1]?.[1] || 0

  const selectMarketDataByToken = (token: Token) => {
    switch (token) {
      case DefiPulseIndex:
        return dpiMarketData
      case DiversifiedStakedETHIndex:
        return dsEthMarketData
      case GitcoinStakedETHIndex:
        return gtcEthMarketData
      case LeveragedRethStakingYield:
        return icRethMarketData
      case MetaverseIndex:
        return mviMarketData
      case BedIndex:
        return bedMarketData
      case Ethereum2xFlexibleLeverageIndex:
        return ethFliMarketData
      case Bitcoin2xFlexibleLeverageIndex:
        return btcFliMarketData
      case icETHIndex:
        return icEthMarketData
      case MoneyMarketIndex:
        return mmiMarketData
      default:
        return 0
    }
  }

  const getMarketDataBySymbol = (
    token: Token
  ): TokenMarketDataValues | null => {
    switch (token) {
      case DefiPulseIndex:
        return dpiMarketData
      case DiversifiedStakedETHIndex:
        return dsEthMarketData
      case GitcoinStakedETHIndex:
        return gtcEthMarketData
      case LeveragedRethStakingYield:
        return icRethMarketData
      case MetaverseIndex:
        return mviMarketData
      case BedIndex:
        return bedMarketData
      case Ethereum2xFlexibleLeverageIndex:
        return ethFliMarketData
      case Bitcoin2xFlexibleLeverageIndex:
        return btcFliMarketData
      case icETHIndex:
        return icEthMarketData
      case IndexToken:
        return indexMarketData
      case MoneyMarketIndex:
        return mmiMarketData
      default:
        return null
    }
  }

  const fetchMarketData = useCallback(async () => {
    const marketData = await Promise.all([
      fetchHistoricalTokenMarketData(ETH.coingeckoId),
      fetchHistoricalTokenMarketData(IndexToken.coingeckoId),
      fetchHistoricalTokenMarketData(DefiPulseIndex.coingeckoId),
      fetchHistoricalTokenMarketData(MetaverseIndex.coingeckoId),
      fetchHistoricalTokenMarketData(BedIndex.coingeckoId),
      fetchHistoricalTokenMarketData(
        Ethereum2xFlexibleLeverageIndex.coingeckoId
      ),
      fetchHistoricalTokenMarketData(
        Bitcoin2xFlexibleLeverageIndex.coingeckoId
      ),
      fetchHistoricalTokenMarketData(icETHIndex.coingeckoId),
      fetchHistoricalTokenMarketData(DiversifiedStakedETHIndex.coingeckoId),
      fetchHistoricalTokenMarketData(GitcoinStakedETHIndex.coingeckoId),
      fetchHistoricalTokenMarketData(MoneyMarketIndex.coingeckoId),
      fetchHistoricalTokenMarketData(LeveragedRethStakingYield.coingeckoId),
    ])

    setEthMarketData(marketData[0])
    setIndexMarketData(marketData[1])
    setDpiMarketData(marketData[2])
    setMviMarketData(marketData[3])
    setBedMarketData(marketData[4])
    setEthFliMarketData(marketData[5])
    setBtcFliMarketData(marketData[6])
    setIcEthMarketData(marketData[7])
    setDsEthMarketData(marketData[8])
    setGtcEthMarketData(marketData[9])
    setMmiMarketData(marketData[10])
    setIcRethMarketData(marketData[11])
  }, [])

  useEffect(() => {
    fetchMarketData()
  }, [fetchMarketData])

  return (
    <MarketDataContext.Provider
      value={{
        getMarketDataBySymbol,
        selectLatestMarketData,
        selectMarketDataByToken,
        eth: ethMarketData,
        index: indexMarketData,
        dpi: dpiMarketData,
        gtceth: gtcEthMarketData,
        mmi: mmiMarketData,
        mvi: mviMarketData,
        bed: bedMarketData,
        ethfli: ethFliMarketData,
        btcfli: btcFliMarketData,
        iceth: icEthMarketData,
      }}
    >
      {props.children}
    </MarketDataContext.Provider>
  )
}
