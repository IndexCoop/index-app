import { IndexApi } from '@/lib/utils/api/index-api'

export async function fetchCumulativeRevenue(address: string) {
  try {
    const indexApi = new IndexApi()
    const res = await indexApi.get(`/prts/fees/${address.toLowerCase()}`)
    return res.cumulative_revenue as number
  } catch (err) {
    console.log(`Error fetching fees for ${address}`, err)
    return null
  }
}

export async function fetchCarryCosts() {
  try {
    const indexApi = new IndexApi()
    const res = await indexApi.get('/carry-costs')

    const formattedRes: Record<string, number> = {}

    const entries = Object.entries(res)
    for (const [key, value] of entries) {
      formattedRes[key.toLowerCase()] = value as number
    }
    return formattedRes
  } catch (err) {
    console.log('Error fetching carry costs', err)
    return null
  }
}
