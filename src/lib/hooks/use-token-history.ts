import { useQuery } from '@tanstack/react-query'
import { AssetTransfersWithMetadataResult } from 'alchemy-sdk'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

import { getLeverageAction } from '@/app/leverage/utils/get-leverage-type'
import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'

export const useTokenHistory = (...tokens: (string | Address)[]) => {
  const { address: user } = useWallet()
  const client = usePublicClient()
  const { chainId } = useNetwork()

  const {
    data: tokenHistory,
    isFetching,
    refetch,
  } = useQuery({
    initialData: [],
    enabled: Boolean(user && chainId && client),
    queryKey: ['leverage-token-history', client, user, tokens, chainId],
    queryFn: async () => {
      const response = await fetch('/api/leverage/legacy-history', {
        method: 'POST',
        body: JSON.stringify({
          user,
          tokens,
          chainId,
        }),
      })

      const transfers =
        (await response.json()) as (AssetTransfersWithMetadataResult & {
          action: ReturnType<typeof getLeverageAction>
        })[]

      return transfers
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
