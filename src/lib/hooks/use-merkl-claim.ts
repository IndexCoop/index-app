import { useCallback, useState } from 'react'
import { useWriteContract } from 'wagmi'

import { getMerklDistributorAddress } from '@/lib/constants/merkl'
import { MERKL_DISTRIBUTOR_ABI } from '@/lib/utils/abi/MerklDistributor'

import { useNetwork } from './use-network'
import { useWallet } from './use-wallet'

import type { MerklRewardsData } from './use-merkl-rewards'

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

    const distributorAddress = getMerklDistributorAddress(chainId)
    if (!distributorAddress) {
      console.info('No distributor address configured')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const users = rewards.map(() => address) as `0x${string}`[]
      const tokens = rewards.map((r) => r.token.address as `0x${string}`)
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
