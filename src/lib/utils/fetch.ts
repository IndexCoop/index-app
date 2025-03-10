import { IndexApi } from '@/lib/utils/api/index-api'

export async function fetchTvl(symbol: string) {
  try {
    const indexApi = new IndexApi()
    const res = await indexApi.get(`/${symbol.toLowerCase()}/marketcap`)
    return res.marketcap as number
  } catch (err) {
    console.warn(`Error fetching marketcap for ${symbol}`, err)
    return null
  }
}

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

export async function fetchCarryCosts() {
  try {
    const indexApi = new IndexApi()
    const res = await indexApi.get('/carry-costs')
    const resBase = await indexApi.get('/carry-costs/base')

    const formattedRes: Record<string, number> = {}

    const entries = [...Object.entries(res), ...Object.entries(resBase)]
    for (const [key, value] of entries) {
      formattedRes[key.toLowerCase()] = value as number
    }
    return formattedRes
  } catch (err) {
    console.warn('Error fetching carry costs', err)
    return null
  }
}
