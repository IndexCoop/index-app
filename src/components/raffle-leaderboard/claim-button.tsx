'use client'

import type { Address } from 'viem'

import { useMerklClaim } from '@/lib/hooks/use-merkl-claim'
import { useMerklRewards } from '@/lib/hooks/use-merkl-rewards'
import { useWallet } from '@/lib/hooks/use-wallet'
import { cn } from '@/lib/utils/tailwind'

type ClaimButtonProps = {
  userAddress: Address
  rewardToken: Address | null
}

export function ClaimButton({ userAddress, rewardToken }: ClaimButtonProps) {
  const { address } = useWallet()
  const { data: rewards = [], refetch } = useMerklRewards(rewardToken)
  const { claim, isLoading, error } = useMerklClaim(rewards)

  const handleClaim = async () => {
    try {
      const hash = await claim()
      console.log('Claim transaction hash:', hash)
      await refetch()
    } catch (err) {
      console.error('Failed to claim rewards:', err)
    }
  }

  const isCurrentUser = address?.toLowerCase() === userAddress.toLowerCase()

  // Don't show anything if not current user or no rewards
  if (!isCurrentUser || rewards.length === 0) {
    return (
      <div className='text-ic-gray-500 flex-[0.4] text-right text-xs'>-</div>
    )
  }

  return (
    <div className='flex flex-[0.4] flex-col items-end gap-1'>
      <button
        onClick={handleClaim}
        disabled={isLoading || !address}
        className={cn(
          'rounded-full px-4 py-1 text-xs font-medium transition',
          isLoading || !address
            ? 'bg-ic-gray-600 text-ic-gray-400 cursor-not-allowed'
            : 'bg-ic-blue-300 hover:bg-ic-blue-400 text-black',
        )}
      >
        {isLoading ? 'Claiming...' : 'Claim now'}
      </button>
      {error && <div className='text-xs text-red-400'>{error}</div>}
    </div>
  )
}
