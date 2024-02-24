import { fetchCoingeckoMarketData } from "@/lib/utils/api/coingecko"

async function fetchIndexApi(path: string) {
  return fetch(`https://api.indexcoop.com${path}`, {
    headers: {
      'X-INDEXCOOP-API-KEY': process.env.NEXT_PUBLIC_INDEX_COOP_API!,
    },
  })
}

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
    const res = await fetchIndexApi(
      `/${symbol
        .toLowerCase()
        .replace(
          '-',
          '',
        )}/analytics`,
    )
    const json = await res.json()
    return json
  } catch {
    return null
  }
}

export async function fetchApy(symbol: string) {
  try {
    const res = await fetchIndexApi(
      `/${symbol.toLowerCase().replace('-', '')}/apy`,
    )
    const json = await res.json()
    return json
  } catch {
    return null
  }
}
