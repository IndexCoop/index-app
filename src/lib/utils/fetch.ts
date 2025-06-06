import { IndexApi } from '@/lib/utils/api/index-api'

export async function fetchCumulativeRevenue(address: string) {
  try {
    const indexApi = new IndexApi()
    const res = await indexApi.get(`/prts/fees/${address.toLowerCase()}`)
    return res.cumulative_revenue as number
  } catch (err) {
    console.warn(`Error fetching fees for ${address}`, err)
    return null
  }
}
