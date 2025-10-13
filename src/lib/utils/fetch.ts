import { GetApiV2PrtsFeesAddressQueryResponse } from '@/gen'

export async function fetchCumulativeRevenue(address: string) {
  try {
    const res = await fetch(`/api/prts/fees/${address.toLowerCase()}`)
    const data: GetApiV2PrtsFeesAddressQueryResponse = await res.json()
    return data.cumulativeRevenue
  } catch (err) {
    console.warn(`Error fetching fees for ${address}`, err)
    return null
  }
}
