import { IndexApiBaseUrl } from '@/constants/server'

export type IndexData = Partial<{
  MarketCap: number
  NetAssetValue: number
  NavChange24Hr: number
  ProductAssetValue: number
  Price: number
  PriceChange24Hr: number
  Supply: number
}>

export type IndexDataMetric =
  | 'marketcap'
  | 'nav'
  | 'navchange'
  | 'pav'
  | 'price'
  | 'pricechange'
  | 'supply'

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
    const latest = json[0] as IndexData
    return latest
  } catch (error) {
    console.error(`Error fetching token metrics: ${url}`, error)
    return null
  }
}

export async function fetchTokenHistoricalData({
  tokenAddress,
  interval = 'minute',
  period = 'day',
}: {
  tokenAddress: string
  interval: IndexDataInterval
  period: IndexDataPeriod
}) {
  const url = formatUrl({
    tokenAddress,
    metrics: ['nav'],
    interval,
    period,
  })
  try {
    const res = await fetch(url)
    const json = await res.json()
    return json.map((data: any) => ({
      nav: data.NetAssetValue as number,
    }))
  } catch (error) {
    console.error(`Error fetching token historical data: ${url}`, error)
    return null
  }
}
