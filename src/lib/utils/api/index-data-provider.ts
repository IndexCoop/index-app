const metricToIndexDataKey = {
  apy: ['APY', 'ApyBase', 'ApyRewards', 'Rate', 'StreamingFee'],
  fees: ['IssueFee', 'RedeemFee', 'StreamingFee'],
  marketcap: ['MarketCap'],
  nav: ['NetAssetValue'],
  navchange: ['NavChange24Hr'],
  pav: ['ProductAssetValue'],
  price: ['Price'],
  pricechange: ['PriceChange24Hr'],
  supply: ['Supply'],
} as const

type MetricKeys = typeof metricToIndexDataKey
type MetricValues = MetricKeys[keyof MetricKeys][number]

export type IndexData = Partial<Record<MetricValues, number>> & {
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
  hostname?: string
  chainId: number
  tokenAddress: string
  metrics?: IndexDataMetric[]
  period?: IndexDataPeriod
  interval?: IndexDataInterval
}

function formatUrl({
  hostname = '',
  chainId,
  tokenAddress,
  metrics = [],
  period = 'latest',
  interval = 'latest',
}: FormatUrlArgs) {
  const searchParams = new URLSearchParams({
    chainId: chainId.toString(),
    period,
    interval,
  })
  for (const metric of metrics) {
    searchParams.append('metrics', metric)
  }
  return `${hostname}/api/data/${tokenAddress}?${searchParams.toString()}`
}

export async function fetchTokenMetrics({
  hostname,
  chainId,
  tokenAddress,
  metrics,
}: {
  hostname?: string
  chainId: number
  tokenAddress: string
  metrics: IndexDataMetric[]
}) {
  const url = formatUrl({ hostname, chainId, tokenAddress, metrics })
  try {
    const res = await fetch(url)
    const json = await res.json()
    const latest = json.metrics[0]
    return metrics.reduce<IndexData>(
      (acc, metric) => {
        const keys = metricToIndexDataKey[metric]
        keys.forEach((key) => {
          acc[key] = latest[key]
        })
        return acc
      },
      { CreatedTimestamp: latest.CreatedTimestamp },
    )
  } catch (error) {
    console.error(`Error fetching token metrics: ${url}`, error)
    return null
  }
}

export async function fetchTokenHistoricalData({
  chainId,
  tokenAddress,
  metrics = ['nav'],
  interval = 'minute',
  period = 'day',
}: {
  chainId: number
  tokenAddress: string
  metrics?: IndexDataMetric[]
  interval?: IndexDataInterval
  period?: IndexDataPeriod
}) {
  const url = formatUrl({
    chainId,
    tokenAddress,
    metrics,
    interval,
    period,
  })
  try {
    const res = await fetch(url)
    const json = await res.json()
    const data = json.metrics as (IndexData & {
      CreatedTimestamp: string
    })[]
    return data
  } catch (error) {
    console.error(`Error fetching token historical data: ${url}`, error)
    return null
  }
}
