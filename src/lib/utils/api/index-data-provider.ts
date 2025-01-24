import { IndexApiBaseUrl } from '@/constants/server'

const metricToIndexDataKey = {
  apy: 'APY',
  // FIXME: Support multiple keys for `fees`
  fees: 'StreamingFee',
  marketcap: 'MarketCap',
  nav: 'NetAssetValue',
  navchange: 'NavChange24Hr',
  pav: 'ProductAssetValue',
  price: 'Price',
  pricechange: 'PriceChange24Hr',
  supply: 'Supply',
} as const

type FromValues<T extends Record<keyof T, string>> = {
  [K in T[keyof T]]: number
}

export type IndexData = Partial<FromValues<typeof metricToIndexDataKey>> & {
  CreatedTimestamp: string
}

export type IndexDataMetric = keyof typeof metricToIndexDataKey

export type IndexDataPeriod =
  | 'latest'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'

export type IndexDataInterval = 'latest' | 'minute' | 'hour' | 'daily'

type FormatUrlArgs = {
  tokenAddress: string
  metrics?: IndexDataMetric[]
  period?: IndexDataPeriod
  interval?: IndexDataInterval
}

function formatUrl({
  tokenAddress,
  metrics = [],
  period = 'latest',
  interval = 'latest',
}: FormatUrlArgs) {
  const searchParams = new URLSearchParams({
    period,
    interval,
  })
  for (const metric of metrics) {
    searchParams.append('metrics', metric)
  }

  return `${IndexApiBaseUrl}/data/tokens/${tokenAddress}?${searchParams.toString()}`
}

export async function fetchTokenMetrics({
  tokenAddress,
  metrics,
}: {
  tokenAddress: string
  metrics: IndexDataMetric[]
}) {
  const url = formatUrl({ tokenAddress, metrics })
  try {
    const res = await fetch(url)
    const json = await res.json()
    const latest = json[0]
    return metrics.reduce<IndexData>(
      (acc, metric) =>
        Object.assign(acc, {
          [metricToIndexDataKey[metric]]: latest[metricToIndexDataKey[metric]],
        }),
      { CreatedTimestamp: latest.CreatedTimestamp },
    )
  } catch (error) {
    console.error(`Error fetching token metrics: ${url}`, error)
    return null
  }
}

export async function fetchTokenHistoricalData({
  tokenAddress,
  metrics = ['nav'],
  interval = 'minute',
  period = 'day',
}: {
  tokenAddress: string
  metrics?: IndexDataMetric[]
  interval?: IndexDataInterval
  period?: IndexDataPeriod
}) {
  const url = formatUrl({
    tokenAddress,
    metrics,
    interval,
    period,
  })
  try {
    const res = await fetch(url)
    const json = (await res.json()) as (IndexData & {
      CreatedTimestamp: string
    })[]

    return json
  } catch (error) {
    console.error(`Error fetching token historical data: ${url}`, error)
    return null
  }
}
