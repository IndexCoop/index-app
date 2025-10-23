'use client'

import Image from 'next/image'
import { useEffect } from 'react'

import { postApiV2RaffleClaim } from '@/gen'
import { useMerklClaim } from '@/lib/hooks/use-merkl-claim'
import { useWallet } from '@/lib/hooks/use-wallet'
import { cn } from '@/lib/utils/tailwind'

import type { MerklRewardsData } from '@/lib/hooks/use-merkl-rewards'
import type { Address } from 'viem'

type ClaimButtonProps = {
  userAddress: Address
  rewardToken: Address | null
  rewards: MerklRewardsData
  refetch: () => Promise<unknown>
  onError?: (error: string | null) => void
}

export function ClaimButton({
  userAddress,
  rewardToken,
  rewards,
  refetch,
  onError,
}: ClaimButtonProps) {
  const { address } = useWallet()
  const { claim, isLoading, error } = useMerklClaim(rewards)

  const handleClaim = async () => {
    // Clear previous errors
    onError?.(null)

    try {
      const hash = await claim()
      console.log('Claim transaction hash:', hash)

      // Fire-and-forget: Call backend to mark epochs as claimed
      if (rewardToken) {
        postApiV2RaffleClaim({
          userAddress,
          rewardToken,
          txHash: hash,
        }).catch((err) => {
          // Silently fail - this is just for our internal tracking
          console.warn('Failed to update claim status in backend:', err)
        })
      }

      await refetch()
    } catch (err) {
      console.error('Failed to claim rewards:', err)
      // Error is already handled by useMerklClaim hook
    }
  }

  // Pass formatted error to parent
  useEffect(() => {
    if (error && onError) {
      const errorMessage = error.includes('User rejected')
        ? 'Transaction cancelled'
        : error.length > 50
          ? 'Transaction failed'
          : error
      onError(errorMessage)
    }
  }, [error, onError])

  const isCurrentUser = address?.toLowerCase() === userAddress.toLowerCase()

  // Only show button for current user
  if (!isCurrentUser) {
    return null
  }

  return (
    <button
      onClick={handleClaim}
      disabled={isLoading || !address}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-medium transition',
        isLoading || !address
          ? 'bg-ic-gray-700 text-ic-gray-400 cursor-not-allowed'
          : 'bg-ic-blue-300 hover:bg-ic-blue-400 text-black',
      )}
    >
      {isLoading ? (
        'Claiming...'
      ) : (
        <>
          <Image
            src='/assets/merkl.jpg'
            alt='Merkl'
            width={14}
            height={14}
            className='rounded-full'
          />
          Claim now
        </>
      )}
    </button>
  )
}
