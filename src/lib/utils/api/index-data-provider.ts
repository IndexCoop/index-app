import { getTokenData } from '@/lib/actions/data'

const metricToIndexDataKey = {
  apy: ['APY', 'ApyBase', 'ApyRewards', 'ApyCost', 'ApyStreamingFee'],
  carrycost: ['CarryCost', 'CarryCostStreamingFee'],
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

type IndexData = Partial<Record<MetricValues, number>> & {
  CreatedTimestamp: string
}

type IndexDataMetric = keyof typeof metricToIndexDataKey

export async function fetchTokenMetrics({
  chainId,
  tokenAddress,
  metrics,
}: {
  hostname?: string
  chainId: number
  tokenAddress: string
  metrics: IndexDataMetric[]
}) {
  try {
    const { data, error } = await getTokenData(tokenAddress, {
      chainId,
      period: 'latest',
      interval: 'latest',
      metrics,
    })

    if (error || !data) {
      console.error(`Error fetching token metrics: ${error}`)
      return null
    }

    const json = data as { metrics: Record<string, unknown>[] }
    const latest = json.metrics[0]
    return metrics.reduce<IndexData>(
      (acc, metric) => {
        const keys = metricToIndexDataKey[metric]
        keys.forEach((key) => {
          acc[key] = latest[key] as number
        })
        return acc
      },
      { CreatedTimestamp: latest.CreatedTimestamp as string },
    )
  } catch (error) {
    console.error(`Error fetching token metrics`, error)
    return null
  }
}
