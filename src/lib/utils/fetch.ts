import { IndexApi } from '@/lib/utils/api/index-api'

export async function fetchTvl(symbol: string) {
  try {
    const indexApi = new IndexApi()
    const res = await indexApi.get(`/${symbol.toLowerCase()}/marketcap`)
    return res.marketcap as number
  } catch (err) {
    console.log(`Error fetching marketcap for ${symbol}`, err)
    return null
  }
}

export async function fetchCumulativeRevenue(symbol: string) {
  try {
    const indexApi = new IndexApi()
    const res = await indexApi.get(`/${symbol.toLowerCase()}/fees`)
    return res.cumulativeRevenue as number
  } catch (err) {
    console.log(`Error fetching fees for ${symbol}`, err)
    return null
  }
}
