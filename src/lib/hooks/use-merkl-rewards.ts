import { isAddressEqual } from '@indexcoop/tokenlists'
import { MerklApi } from '@merkl/api'
import { useQuery } from '@tanstack/react-query'

import { useNetwork } from './use-network'
import { useWallet } from './use-wallet'

import type { Address } from 'viem'

const fetchMerklRewards = async (
  address: Address,
  chainId: number,
  rewardTokens?: Address | Address[] | null,
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

  const allRewards = data
    .flatMap((r) => r.rewards)
    .filter((r) => {
      const unclaimed = BigInt(r.amount) - BigInt(r.claimed || 0)
      return unclaimed > 0
    })

  // If no filter specified, return all rewards
  if (!rewardTokens) {
    return allRewards
  }

  // Convert to array for consistent handling
  const tokensArray = Array.isArray(rewardTokens)
    ? rewardTokens
    : [rewardTokens]

  // Filter by specified token(s)
  return allRewards.filter((r) =>
    tokensArray.some((token) => isAddressEqual(r.token.address, token)),
  )
}

export type MerklRewardsData = Awaited<ReturnType<typeof fetchMerklRewards>>

export const useMerklRewards = (rewardTokens?: Address | Address[] | null) => {
  const { address } = useWallet()
  const { chainId } = useNetwork()

  // Normalize query key for consistent caching
  const queryKey = [
    'merkl-rewards',
    address,
    chainId,
    Array.isArray(rewardTokens)
      ? rewardTokens.sort().join(',')
      : rewardTokens || 'all',
  ]

  return useQuery({
    queryKey,
    placeholderData: [],
    queryFn: () => {
      if (!address || !chainId) {
        return [] as MerklRewardsData
      }
      return fetchMerklRewards(address as Address, chainId, rewardTokens)
    },
    enabled: !!address && !!chainId,
    refetchInterval: 5000,
    staleTime: 30000,
  })
}
