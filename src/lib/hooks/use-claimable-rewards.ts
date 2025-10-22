import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { isAddressEqual } from 'viem'

import { getApiV2RaffleEpochs } from '@/gen'

import { useMerklRewards } from './use-merkl-rewards'
import { useUserRaffleStatus } from './use-user-raffle-status'

import type { Address } from 'viem'

export type ClaimableToken = {
  rewardToken: string
  totalClaimable: string
  hasUnclaimedRewards: boolean
  hasMerklRewards: boolean
}

export const useClaimableRewards = (address?: string) => {
  const { data: status } = useUserRaffleStatus(address)

  // Fetch all epochs to get their reward tokens
  const { data: epochsData } = useQuery({
    queryKey: ['raffle-epochs-for-rewards'],
    queryFn: async () => {
      const response = await getApiV2RaffleEpochs({})
      return response.data ?? []
    },
  })

  // Get unique reward tokens from all epochs
  const rewardTokens = useMemo(() => {
    if (!epochsData) return []
    const tokens = epochsData
      .map((epoch) => epoch.rewardToken)
      .filter((token): token is string => !!token)
    return [...new Set(tokens)] as Address[] // Remove duplicates
  }, [epochsData])

  // Fetch Merkl rewards filtered by epoch reward tokens
  const { data: allMerklRewards = [] } = useMerklRewards(
    rewardTokens.length > 0 ? rewardTokens : null,
  )

  // Combine database winners with Merkl rewards
  const tokensToShow = useMemo(() => {
    const tokenMap = new Map<
      string,
      {
        rewardToken: string
        totalClaimable: string
        hasUnclaimedRewards: boolean
        hasMerklRewards: boolean
      }
    >()

    // Add database winners
    if (status?.tokens) {
      status.tokens.forEach((token) => {
        tokenMap.set(token.rewardToken.toLowerCase(), {
          rewardToken: token.rewardToken,
          totalClaimable: token.totalClaimable,
          hasUnclaimedRewards: token.hasUnclaimedRewards,
          hasMerklRewards: false, // Will be updated below
        })
      })
    }

    // Filter Merkl rewards by epoch reward tokens
    rewardTokens.forEach((epochToken) => {
      const normalizedEpochToken = epochToken.toLowerCase()

      // Check if this epoch token has Merkl rewards
      const hasMerklRewards = allMerklRewards.some((reward) =>
        isAddressEqual(reward.token.address as Address, epochToken as Address),
      )

      if (hasMerklRewards) {
        const existing = tokenMap.get(normalizedEpochToken)

        if (existing) {
          // Update existing entry to mark it has Merkl rewards
          existing.hasMerklRewards = true
        } else {
          // Add new entry for Merkl rewards (not in database)
          tokenMap.set(normalizedEpochToken, {
            rewardToken: epochToken,
            totalClaimable: '0',
            hasUnclaimedRewards: false,
            hasMerklRewards: true,
          })
        }
      }
    })

    return Array.from(tokenMap.values())
  }, [status, allMerklRewards, rewardTokens])

  return tokensToShow
}
