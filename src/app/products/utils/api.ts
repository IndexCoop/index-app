import { fetchCoingeckoMarketData } from '@/lib/utils/api/coingecko'
import { IndexApi } from '@/lib/utils/api/index-api'

export async function fetchMarketData(address: string) {
  try {
    const res = await fetchCoingeckoMarketData(address)
    return res
  } catch {
    return null
  }
}

export async function fetchAnalytics(symbol: string) {
  try {
    const indexApi = new IndexApi()
    const res = await indexApi.get(`/${symbol.toLowerCase()}/analytics`)
    return res
  } catch {
    return null
  }
}

export async function fetchApy(symbol: string) {
  try {
    const indexApi = new IndexApi()
    const res = await indexApi.get(
      `/${symbol.toLowerCase()}/apy`,
    )
    return res
  } catch {
    return null
  }
}
