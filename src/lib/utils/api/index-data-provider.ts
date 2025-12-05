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

type FormatUrlArgs = {
  hostname?: string
  chainId: number
  tokenAddress: string
  metrics?: IndexDataMetric[]
}

function formatUrl({
  hostname = '',
  chainId,
  tokenAddress,
  metrics = [],
}: FormatUrlArgs) {
  const searchParams = new URLSearchParams({
    chainId: chainId.toString(),
    period: 'latest',
    interval: 'latest',
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
