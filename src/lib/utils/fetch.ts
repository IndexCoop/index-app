import { Token } from '@/constants/tokens'
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

export async function fetchCarryCosts(inputOutputToken: Token) {
  try {
    const indexApi = new IndexApi()
    const res = await indexApi.get('/carry-costs')

    const symbol = inputOutputToken.symbol.toLowerCase()
    const foundKey = Object.keys(res).find(
      (key) => key.toLowerCase() === symbol,
    )

    if (!foundKey) return null
    return res[foundKey] as number
  } catch (err) {
    console.log(
      `Error fetching carry costs for ${inputOutputToken.symbol}`,
      err,
    )
    return null
  }
}
