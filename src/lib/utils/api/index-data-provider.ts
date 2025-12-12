import { getTokenData } from '@/lib/actions/data'

export async function fetchTokenNAV({
  chainId,
  tokenAddress,
}: {
  chainId: number
  tokenAddress: string
}) {
  try {
    const { data, error } = await getTokenData(tokenAddress, {
      chainId,
      metrics: ['nav'],
    })

    if (error || !data) {
      console.error(`Error fetching token metrics: ${error}`)
      return null
    }

    const json = data as { metrics: Record<string, unknown>[] }
    const latest = json.metrics[0]
    return latest?.NetAssetValue as number | null
  } catch (error) {
    console.error(`Error fetching token metrics`, error)
    return null
  }
}
