import { BigNumber } from '@ethersproject/bignumber'

import { useBalances } from 'hooks/useBalances'
import {
  TokenMarketDataValues,
  useMarketData,
} from 'providers/MarketData/MarketDataProvider'

export interface UserTokenBalance {
  symbol: string
  balance: BigNumber
  marketData: TokenMarketDataValues
}

function getTokenMarketDataValuesOrNull(
  symbol: string,
  marketDataValues: TokenMarketDataValues | undefined,
  balance: BigNumber | undefined
): UserTokenBalance | undefined {
  if (
    marketDataValues === undefined ||
    marketDataValues.hourlyPrices === undefined
  ) {
    return undefined
  }

  if (balance === undefined || balance.isZero() || balance.isNegative()) {
    return undefined
  }

  const e18 = BigNumber.from('1000000000000000000')
  const balanceNum = parseFloat(balance.div(e18).toString())
  const hourlyData = marketDataValues.hourlyPrices.map(([date, price]) => [
    date,
    price * balanceNum,
  ])

  return { symbol, balance, marketData: { hourlyPrices: hourlyData } }
}

function getTotalHourlyPrices(marketData: UserTokenBalance[]) {
  const hourlyPricesOnly = marketData.map(
    (data) => data.marketData.hourlyPrices ?? []
  )
  let totalHourlyPrices: number[][] = []
  if (hourlyPricesOnly.length > 0) {
    totalHourlyPrices = hourlyPricesOnly[0]
    for (let i = 1; i < hourlyPricesOnly.length; i += 1) {
      for (let k = 0; k < totalHourlyPrices[0].length; k += 1) {
        totalHourlyPrices[k][1] += hourlyPricesOnly[i][k][1]
      }
    }
  }
  return totalHourlyPrices
}

export const useUserBalances = () => {
  const {
    bedBalance,
    dataBalance,
    dpiBalance,
    mviBalance,
    gmiBalance,
    ethFliBalance,
    btcFliBalance,
    ethFliPBalance,
  } = useBalances()
  const { bed, data, dpi, mvi, gmi, btcfli, ethfli, ethflip } = useMarketData()

  const balances = [
    { title: 'DPI', value: dpiBalance },
    { title: 'MVI', value: mviBalance },
    { title: 'DATA', value: dataBalance },
    { title: 'BED', value: bedBalance },
    { title: 'GMI', value: gmiBalance },
    { title: 'ETH2x-FLI', value: ethFliBalance },
    { title: 'ETH2x-FLI-P', value: ethFliPBalance },
    { title: 'BTC2x-FLI', value: btcFliBalance },
  ]

  const userBalances: UserTokenBalance[] = balances
    .map((pos) => {
      switch (pos.title) {
        case 'DPI':
          return getTokenMarketDataValuesOrNull(pos.title, dpi, pos.value)
        case 'MVI':
          return getTokenMarketDataValuesOrNull(pos.title, mvi, pos.value)
        case 'DATA':
          return getTokenMarketDataValuesOrNull(pos.title, data, pos.value)
        case 'BED':
          return getTokenMarketDataValuesOrNull(pos.title, bed, pos.value)
        case 'GMI':
          return getTokenMarketDataValuesOrNull(pos.title, gmi, pos.value)
        case 'ETH2x-FLI':
          return getTokenMarketDataValuesOrNull(pos.title, ethfli, pos.value)
        case 'ETH2x-FLI-P':
          return getTokenMarketDataValuesOrNull(pos.title, ethflip, pos.value)
        case 'BTC2x-FLI':
          return getTokenMarketDataValuesOrNull(pos.title, btcfli, pos.value)
        default:
          return undefined
      }
    })
    // Remove undefined
    .filter((tokenData): tokenData is UserTokenBalance => !!tokenData)

  const totalHourlyPrices = getTotalHourlyPrices(userBalances)

  return { userBalances, totalHourlyPrices }
}
