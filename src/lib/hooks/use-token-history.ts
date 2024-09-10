import { useQuery } from '@tanstack/react-query'
import { AssetTransfersWithMetadataResult } from 'alchemy-sdk'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

export const useTokenHistory = (...tokens: (string | Address)[]) => {
  const { address: user, chainId } = useAccount()

  const {
    data: tokenHistory,
    isLoading,
    refetch,
  } = useQuery({
    initialData: [],
    enabled: Boolean(user && chainId),
    queryKey: ['leverage-token-history'],
    queryFn: async () => {
      const response = await fetch('/api/leverage/tx-history', {
        method: 'POST',
        body: JSON.stringify({
          user,
          tokens,
          chainId,
        }),
      })

      return response.json() as Promise<AssetTransfersWithMetadataResult[]>
    },
    select: (data) =>
      data.sort(
        (a, b) =>
          new Date(b.metadata.blockTimestamp).getTime() -
          new Date(a.metadata.blockTimestamp).getTime(),
      ),
  })

  return {
    tokenHistory,
    isLoading,
    refetch,
  }
}
