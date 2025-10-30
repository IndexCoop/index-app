import { useCallback, useState } from 'react'
import { useWriteContract } from 'wagmi'

import { getMerklDistributorAddress } from '@/lib/constants/merkl'
import { MERKL_DISTRIBUTOR_ABI } from '@/lib/utils/abi/MerklDistributor'

import { useNetwork } from './use-network'
import { useWallet } from './use-wallet'

import type { MerklRewardsData } from './use-merkl-rewards'

export const useMerklClaim = (rewards: MerklRewardsData) => {
  const { address } = useWallet()
  const { chainId, switchChain } = useNetwork()
  const { writeContractAsync } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const claim = useCallback(async () => {
    if (!address || rewards.length === 0) {
      console.info('No rewards to claim')
      return
    }

    // Group rewards by chain
    const rewardsByChain = rewards.reduce(
      (acc, reward) => {
        const rewardChainId = reward.token.chainId
        if (!acc[rewardChainId]) {
          acc[rewardChainId] = []
        }
        acc[rewardChainId].push(reward)
        return acc
      },
      {} as Record<number, typeof rewards>,
    )

    // Determine which chain to claim from
    // Priority: current chain if it has rewards, otherwise first chain with rewards
    const targetChainId =
      chainId && rewardsByChain[chainId]
        ? chainId
        : Number(Object.keys(rewardsByChain)[0])

    const rewardsToClaim = rewardsByChain[targetChainId]

    if (!rewardsToClaim || rewardsToClaim.length === 0) {
      console.info('No rewards to claim on any chain')
      return
    }

    const distributorAddress = getMerklDistributorAddress(targetChainId)
    if (!distributorAddress) {
      console.info(
        `No distributor address configured for chain ${targetChainId}`,
      )
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Switch to the correct network if needed
      if (chainId !== targetChainId) {
        console.info(`Switching to chain ${targetChainId} to claim rewards`)
        await switchChain({ chainId: targetChainId })
      }

      const users = rewardsToClaim.map(() => address) as `0x${string}`[]
      const tokens = rewardsToClaim.map((r) => r.token.address as `0x${string}`)
      const amounts = rewardsToClaim.map((r) => BigInt(r.amount))
      const proofs = rewardsToClaim.map(
        (r) => r.proofs as unknown as readonly `0x${string}`[],
      )

      const hash = await writeContractAsync({
        address: distributorAddress,
        abi: MERKL_DISTRIBUTOR_ABI,
        functionName: 'claim',
        args: [users, tokens, amounts, proofs],
        chainId: targetChainId,
      })

      return hash
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to claim rewards'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [address, chainId, rewards, switchChain, writeContractAsync])

  return {
    claim,
    isLoading,
    error,
  }
}
