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

    const json = result.data as { metrics: Record<string, unknown>[] }
    const latest = json.metrics[0]
    return latest?.NetAssetValue as number | null
  } catch (error) {
    console.error(`Error fetching token metrics`, error)
    return null
  }
}
