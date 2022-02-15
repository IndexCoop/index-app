import { BigNumber } from '@ethersproject/bignumber'

import { TokenMarketDataValues } from 'contexts/MarketData/MarketDataProvider'

import { PriceChartData, PriceChartRangeOption } from './MarketChart'

export interface MarketDataAndBalance {
  balance: BigNumber
  marketData: TokenMarketDataValues
}

function getChartData(
  range: PriceChartRangeOption,
  prices: number[][][]
): PriceChartData[] {
  const hourlyDataInterval = 24
  const pricesFromRange: any[] = prices.map((priceData: number[][]) => {
    return priceData.slice(-range * hourlyDataInterval) ?? []
  })

  if (pricesFromRange.length < 1) {
    return []
  }

  const chartData: PriceChartData[] = []
  for (let i = 0; i < pricesFromRange[0].length; i += 1) {
    const y: number[] = []

    for (let k = 0; k < pricesFromRange.length; k += 1) {
      const price: number =
        pricesFromRange[k][i] === undefined ? 0 : pricesFromRange[k][i][1]
      y.push(price)
    }

    const data: PriceChartData = {
      x: pricesFromRange[0][i][0],
      y1: y[0],
      y2: y[1],
      y3: y[2],
      y4: y[3],
      y5: y[4],
    }

    chartData.push(data)
  }

  return chartData
}

export function getMarketChartData(marketData: TokenMarketDataValues[]) {
  let ranges = [
    PriceChartRangeOption.DAILY_PRICE_RANGE,
    PriceChartRangeOption.WEEKLY_PRICE_RANGE,
    PriceChartRangeOption.MONTHLY_PRICE_RANGE,
    PriceChartRangeOption.QUARTERLY_PRICE_RANGE,
    PriceChartRangeOption.YEARLY_PRICE_RANGE,
  ]

  const marketChartData: PriceChartData[][] = []
  ranges.forEach((range) => {
    const prices = marketData.map((data) => data.hourlyPrices ?? [])
    const chartData = getChartData(range, prices)
    marketChartData.push(chartData)
  })

  return marketChartData
}

export function getTokenMarketDataValuesOrNull(
  marketDataValues: TokenMarketDataValues | undefined,
  balance: BigNumber | undefined
): MarketDataAndBalance | undefined {
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

  return { balance, marketData: { hourlyPrices: hourlyData } }
}
