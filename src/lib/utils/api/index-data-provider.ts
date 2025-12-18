import { getTokenData } from '@/lib/actions/data'

export async function fetchTokenNAV({
  chainId,
  tokenAddress,
}: {
  chainId: number
  tokenAddress: string
}) {
  try {
    const result = await getTokenData(tokenAddress, {
      chainId,
      metrics: ['nav'],
    })

    if (result.error) {
      console.error(`Error fetching token metrics`)
      return null
    }

    const json = result.data
    const latest = json?.metrics[0]
    // Different APIs return different field names
    return latest?.NAV ?? (latest as any)?.NetAssetValue ?? null
  } catch (error) {
    console.error(`Error fetching token metrics`, error)
    return null
  }
}
