import { PriceChartRangeOption } from 'components/product/MarketChart'

interface PriceChange {
  abs: number
  rel: number
  isPositive: boolean
}

function getChangeInPrice(priceData: number[][]): PriceChange {
  if (priceData[0] === undefined) {
    return {
      abs: 0,
      rel: 0,
      isPositive: true,
    }
  }

  const firstPrice = priceData[0][1]
  const lastPrice = priceData.slice(-1)[0][1]
  const diff = lastPrice - firstPrice

  const abs = Math.abs(diff)
  const isPositive = diff >= 0
  const rel = (abs / firstPrice) * 100

  return {
    abs,
    rel,
    isPositive,
  }
}

export function getFormattedChartPriceChanges(priceChanges: PriceChange[]) {
  // ['+10.53 ( +5.89% )', '+6.53 ( +2.89% )', ...]
  const priceChangesFormatted = priceChanges.map((change) => {
    const plusOrMinus = change.isPositive ? '+' : '-'
    return {
      label: `${plusOrMinus}$${change.abs.toFixed(
        2
      )} ( ${plusOrMinus} ${change.rel.toFixed(2)}% )`,
      isPositive: change.isPositive,
    }
  })
  return priceChangesFormatted
}

export function getPricesChanges(priceData: number[][]): PriceChange[] {
  const hourlyDataInterval = 24
  let ranges = [
    PriceChartRangeOption.DAILY_PRICE_RANGE,
    PriceChartRangeOption.WEEKLY_PRICE_RANGE,
    PriceChartRangeOption.MONTHLY_PRICE_RANGE,
    PriceChartRangeOption.QUARTERLY_PRICE_RANGE,
    PriceChartRangeOption.YEARLY_PRICE_RANGE,
  ]

  const changes: PriceChange[] = []
  ranges.forEach((range) => {
    const prices = priceData.slice(-range * hourlyDataInterval)
    const change = getChangeInPrice(prices)
    changes.push(change)
  })

  return changes
}
