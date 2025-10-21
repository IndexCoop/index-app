import { MerklApi } from '@merkl/api'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

import { useNetwork } from './use-network'
import { useWallet } from './use-wallet'

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
        claimableOnly: true,
        type: 'TOKEN',
      },
    })

  if (status !== 200 || !data) {
    return []
  }

  return data
    .flatMap((r) => r.rewards)
    .filter(
      (reward) =>
        reward.token.address.toLowerCase() === rewardToken.toLowerCase(),
    )
}

export type MerklRewardsData = Awaited<ReturnType<typeof fetchMerklRewards>>

export const useMerklRewards = (rewardToken: Address | null) => {
  const { address } = useWallet()
  const { chainId } = useNetwork()

  return useQuery({
    queryKey: ['merkl-rewards', address, chainId, rewardToken],
    initialData: [],
    queryFn: () => {
      if (!address || !chainId || !rewardToken) {
        return [] as MerklRewardsData
      }
      return fetchMerklRewards(address as Address, chainId, rewardToken)
    },
    enabled: !!address && !!chainId && !!rewardToken,
    refetchInterval: false,
    staleTime: 30000,
    select: (data) => {
      console.log(data)
      return data
    },
  })
}
