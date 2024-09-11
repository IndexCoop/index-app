import { useQuery } from '@tanstack/react-query'
import { AssetTransfersWithMetadataResult } from 'alchemy-sdk'
import { Address } from 'viem'

import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'

export const useTokenHistory = (...tokens: (string | Address)[]) => {
  const { address: user } = useWallet()
  const { chainId } = useNetwork()

  const {
    data: tokenHistory,
    isFetching,
    refetch,
  } = useQuery({
    initialData: [],
    enabled: Boolean(user && chainId),
    queryKey: ['leverage-token-history', user, tokens, chainId],
    queryFn: async () => {
      const response = await fetch('/api/leverage/history', {
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
    isFetching,
    refetch,
  }
}
