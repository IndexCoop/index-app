import { useCallback, useState } from 'react'
import { useWriteContract } from 'wagmi'

import { MERKL_DISTRIBUTOR_ABI } from '@/lib/utils/abi/MerklDistributor'

import { useNetwork } from './use-network'
import { useWallet } from './use-wallet'

import type { MerklRewardsData } from './use-merkl-rewards'
import type { Address } from 'viem'

const DISTRIBUTOR_ADDRESSES: Record<number, Address> = {
  1: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae',
} as const

const getDistributorAddress = (chainId: number) => {
  return DISTRIBUTOR_ADDRESSES[chainId]
}

export const useMerklClaim = (rewards: MerklRewardsData) => {
  const { address } = useWallet()
  const { chainId } = useNetwork()
  const { writeContractAsync } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const claim = useCallback(async () => {
    if (!address || !chainId || rewards.length === 0) {
      console.info('No rewards to claim')
      return
    }

    const distributorAddress = getDistributorAddress(chainId)
    if (!distributorAddress) {
      console.info('No distributor address configured for chain', chainId)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const users = rewards.map(() => address) as Address[]
      const tokens = rewards.map((r) => r.token.address as Address)
      const amounts = rewards.map((r) => BigInt(r.amount))
      const proofs = rewards.map(
        (r) => r.proofs as unknown as readonly `0x${string}`[],
      )

      const hash = await writeContractAsync({
        address: distributorAddress,
        abi: MERKL_DISTRIBUTOR_ABI,
        functionName: 'claim',
        args: [users, tokens, amounts, proofs],
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
  }, [address, chainId, rewards, writeContractAsync])

  return {
    claim,
    isLoading,
    error,
  }
}
