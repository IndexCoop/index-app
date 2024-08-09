import { IndexApiBaseUrl } from '@/constants/server'

export enum IndexDataMetric {
  Fees = 'fees',
  MarketCap = 'marketcap',
  Nav = 'nav',
  NavChange = 'navchange',
  Price = 'price',
  PriceChange = 'pricechange',
  ProductComposition = 'productcomposition',
  Supply = 'supply',
  Volume = 'volume',
}

function formatUrl(
  tokenAddress: string,
  chainId: number,
  metrics: IndexDataMetric[],
) {
  const searchParams = new URLSearchParams({
    chainId: chainId.toString(),
  })
  for (const metric of metrics) {
    searchParams.append('metrics', metric)
  }

  return `${IndexApiBaseUrl}/data/tokens/${tokenAddress}?${searchParams.toString()}`
}

export class IndexDataProvider {
  async getTokenMetrics({
    tokenAddress,
    chainId = 1,
    metrics,
  }: {
    tokenAddress: string
    chainId?: number
    metrics: IndexDataMetric[]
  }) {
    const url = formatUrl(tokenAddress, chainId, metrics)
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
}
