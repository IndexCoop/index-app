import { PriceChartData, PriceChartRangeOption } from './MarketChart'

export const getChartData = (
  range: PriceChartRangeOption,
  prices: number[][][]
): PriceChartData[] => {
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
      x: pricesFromRange[0][0][0],
      y1: y[0],
      y2: y[1],
    }
    chartData.push(data)
  }

  return chartData
}
