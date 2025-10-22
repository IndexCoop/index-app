import { isAddressEqual } from '@indexcoop/tokenlists'
import { MerklApi } from '@merkl/api'
import { useQuery } from '@tanstack/react-query'

import { useNetwork } from './use-network'
import { useWallet } from './use-wallet'

import type { Address } from 'viem'

const fetchMerklRewards = async (
  address: Address,
  chainId: number,
  rewardToken: Address,
) => {
  const { status, data } = await MerklApi('https://api.merkl.xyz')
    .v4.users({ address })
    .rewards.get({
      query: {
        chainId: [chainId.toString()],
        breakdownPage: 0,
      },
    })

  console.log(data)

  if (status !== 200 || !data) {
    return []
  }

  return data
    .flatMap((r) => r.rewards)
    .filter((r) => {
      return (
        BigInt(r.amount) > 0 && isAddressEqual(r.token.address, rewardToken)
      )
    })
}

export type MerklRewardsData = Awaited<ReturnType<typeof fetchMerklRewards>>

export const useMerklRewards = (rewardToken: Address | null) => {
  const { address } = useWallet()
  const { chainId } = useNetwork()
  return useQuery({
    queryKey: ['merkl-rewards', address, chainId, rewardToken],
    placeholderData: [],
    queryFn: () => {
      if (!address || !chainId || !rewardToken) {
        return [] as MerklRewardsData
      }
      return fetchMerklRewards(address as Address, chainId, rewardToken)
    },
    enabled: !!address && !!chainId && !!rewardToken,
    refetchInterval: 5000,
    staleTime: 30000,
  })
}
