import { isAddressEqual } from '@indexcoop/tokenlists'
import { MerklApi } from '@merkl/api'
import { useQuery } from '@tanstack/react-query'
import { readContract } from '@wagmi/core'

import { getMerklDistributorAddress } from '@/lib/constants/merkl'
import { MERKL_DISTRIBUTOR_ABI } from '@/lib/utils/abi/MerklDistributor'
import { wagmiAdapter } from '@/lib/utils/wagmi'

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

  if (status !== 200 || !data) {
    return []
  }

  const distributorAddress = getMerklDistributorAddress(chainId)
  if (!distributorAddress) {
    console.warn('No distributor address configured')
    return []
  }

  const apiRewards = data.flatMap((r) => r.rewards)

  const rewardsWithContractClaimed = await Promise.all(
    apiRewards.map(async (reward) => {
      try {
        const [claimedAmount] = await readContract(wagmiAdapter.wagmiConfig, {
          address: distributorAddress,
          abi: MERKL_DISTRIBUTOR_ABI,
          functionName: 'claimed',
          args: [address, reward.token.address as Address],
        })

        const unclaimed = BigInt(reward.amount) - BigInt(claimedAmount)

        return {
          ...reward,
          unclaimed: unclaimed.toString(),
          hasUnclaimed: unclaimed > 0,
        }
      } catch (error) {
        console.error('Error checking claimed amount:', error)
        const unclaimed = BigInt(reward.amount) - BigInt(reward.claimed || 0)
        return {
          ...reward,
          unclaimed: unclaimed.toString(),
          hasUnclaimed: unclaimed > 0,
        }
      }
    }),
  )

  const allRewards = rewardsWithContractClaimed.filter((r) => r.hasUnclaimed)

  if (!rewardTokens) {
    return allRewards
  }

  const tokensArray = Array.isArray(rewardTokens)
    ? rewardTokens
    : [rewardTokens]

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
    refetchInterval: 30000,
    staleTime: 60000,
  })
}
