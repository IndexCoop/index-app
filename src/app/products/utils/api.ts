import { IndexApi } from '@/lib/utils/api/index-api'

export async function fetchApy(symbol: string) {
  try {
    const indexApi = new IndexApi()
    const res = await indexApi.get(`/${symbol.toLowerCase()}/apy`)
    return res
  } catch {
    return null
  }
}
