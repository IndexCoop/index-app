import { IndexApiBaseUrl } from '@/constants/server'

export enum IndexDataMetric {
  Fees = 'fees',
  MarketCap = 'marketcap',
  Nav = 'nav',
  NavChange = 'navchange',
  Pav = 'pav',
  Price = 'price',
  PriceChange = 'pricechange',
  ProductComposition = 'productcomposition',
  Supply = 'supply',
  Volume = 'volume',
}

export enum IndexDataInterval {
  Latest = 'latest',
  Minute = 'minute',
  Hour = 'hour',
  Daily = 'daily',
}

export enum IndexDataPeriod {
  Latest = 'latest',
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Quarter = 'quarter',
  Year = 'year',
}

type FormatUrlArgs = {
  tokenAddress: string
  chainId?: number
  metrics?: IndexDataMetric[]
  period?: IndexDataPeriod
  interval?: IndexDataInterval
}
function formatUrl({
  tokenAddress,
  chainId = 1,
  metrics = [],
  period = IndexDataPeriod.Latest,
  interval = IndexDataInterval.Latest,
}: FormatUrlArgs) {
  const searchParams = new URLSearchParams({
    chainId: chainId.toString(),
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
  chainId = 1,
  metrics,
}: {
  tokenAddress: string
  chainId?: number
  metrics: IndexDataMetric[]
}) {
  const url = formatUrl({ tokenAddress, chainId, metrics })
  try {
    const res = await fetch(url)
    const json = await res.json()
    const latest = json[0]
    return {
      marketCap: metrics.includes(IndexDataMetric.MarketCap)
        ? (latest.MarketCap as number)
        : undefined,
      nav: metrics.includes(IndexDataMetric.Nav)
        ? (latest.NetAssetValue as number)
        : undefined,
      navChange: metrics.includes(IndexDataMetric.NavChange)
        ? (latest.NavChange24Hr as number) * 100
        : undefined,
      pav: metrics.includes(IndexDataMetric.Pav)
        ? (latest.ProductAssetValue as number)
        : undefined,
      price: metrics.includes(IndexDataMetric.Price)
        ? (latest.Price as number)
        : undefined,
      priceChange: metrics.includes(IndexDataMetric.PriceChange)
        ? (latest.PriceChange24Hr as number)
        : undefined,
      supply: metrics.includes(IndexDataMetric.Supply)
        ? (latest.Supply as number)
        : undefined,
    }
  } catch (error) {
    console.error(`Error fetching token metrics: ${url}`, error)
    return null
  }
}

export async function fetchTokenHistoricalData({
  tokenAddress,
  chainId = 1,
  interval = IndexDataInterval.Minute,
  period = IndexDataPeriod.Day,
}: {
  tokenAddress: string
  chainId?: number
  interval: IndexDataInterval
  period: IndexDataPeriod
}) {
  const url = formatUrl({
    tokenAddress,
    chainId,
    metrics: [IndexDataMetric.Nav],
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
