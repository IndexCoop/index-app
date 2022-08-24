import { TokenMarketDataValues } from 'providers/MarketData'

import { PriceChartData, PriceChartRangeOption } from './MarketChart'

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

export function getPriceChartData(marketData: TokenMarketDataValues[]) {
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
