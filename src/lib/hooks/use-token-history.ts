import { useQuery } from '@tanstack/react-query'
import { AssetTransfersWithMetadataResult } from 'alchemy-sdk'
import { Address, zeroAddress } from 'viem'
import { usePublicClient } from 'wagmi'

import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isContract } from '@/lib/utils'

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
      const response = await fetch('/api/leverage/history', {
        method: 'POST',
        body: JSON.stringify({
          user,
          tokens,
          chainId,
        }),
      })

      const transfers =
        (await response.json()) as AssetTransfersWithMetadataResult[]

      return Promise.all(
        transfers.map(async (transfer) => {
          const isFromContract = await isContract(client!, transfer.from)
          const isToContract = await isContract(client!, transfer.to!)

          return {
            ...transfer,

            isMint: transfer.from === zeroAddress,
            isFromUser: transfer.from === user?.toLowerCase(),
            isToUser: transfer.to === user?.toLowerCase(),
            isFromContract,
            isToContract,
          }
        }),
      )
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
