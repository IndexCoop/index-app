'use client'

import { getTokenByChainAndAddress } from '@indexcoop/tokenlists'
import { formatUnits } from 'viem'

import { useMerklRewards } from '@/lib/hooks/use-merkl-rewards'
import { useUserRaffleStatus } from '@/lib/hooks/use-user-raffle-status'
import { useWallet } from '@/lib/hooks/use-wallet'

import { ClaimButton } from './claim-button'

import type { Address } from 'viem'

type UserWinnerRowProps = {
  epoch: {
    id: number
    startDate: string
    endDate: string
    drawCompleted: boolean
    rewardToken: string | null
  }
}

export function UserWinnerRow({ epoch }: UserWinnerRowProps) {
  const { address } = useWallet()
  const { data: rewards = [] } = useMerklRewards(
    epoch.rewardToken as Address | null,
  )
  const { data: status } = useUserRaffleStatus(address)

  const hasMerklRewards = rewards.length > 0
  const hasUnclaimedRewards = status?.hasUnclaimedRewards ?? false

  // Show if: user has Merkl rewards OR user has unclaimed rewards from status
  if (!address || (!hasMerklRewards && !hasUnclaimedRewards)) {
    return null
  }

  const rewardToken = epoch.rewardToken
    ? getTokenByChainAndAddress(1, epoch.rewardToken)
    : null
  const tokenDecimals = rewardToken?.decimals ?? 18
  const tokenSymbol = rewardToken?.symbol ?? 'INDEX'

  // Calculate display amount
  let displayTotal: string
  if (hasMerklRewards) {
    // Calculate total from Merkl rewards
    const totalRewards = rewards.reduce((sum, reward) => {
      const amount = reward?.amount ? BigInt(reward.amount) : BigInt(0)
      return sum + amount
    }, BigInt(0))
    const totalRewardsFormatted = formatUnits(totalRewards, tokenDecimals)
    displayTotal = Number(totalRewardsFormatted).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })
  } else if (status?.totalClaimable) {
    // Use total claimable from status endpoint (processing state)
    const totalFormatted = formatUnits(
      BigInt(status.totalClaimable),
      tokenDecimals,
    )
    displayTotal = Number(totalFormatted).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })
  } else {
    displayTotal = '0'
  }

  return (
    <div className='border-ic-gray-600 mb-4 flex w-full items-center justify-between rounded-lg border bg-gradient-to-r from-[#061010] to-[#0a1a1a] p-4 shadow-lg'>
      {/* Wallet */}
      <div className='flex-1'>
        <div className='text-ic-gray-400 mb-1 text-xs'>Wallet</div>
        <div className='text-ic-white flex items-center gap-2'>
          <span className='font-mono text-sm'>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <span className='bg-ic-blue-300 rounded px-2 py-0.5 text-xs text-black'>
            You
          </span>
        </div>
      </div>

      {/* Total INDEX Available to Claim */}
      <div className='flex-[0.8] text-center'>
        <div className='text-ic-gray-400 mb-1 text-xs'>
          Total {tokenSymbol} to Claim
        </div>
        <div className='text-ic-blue-300 text-lg font-bold'>{displayTotal}</div>
      </div>

      {/* Claim Button */}
      <div className='flex-[0.4] text-right'>
        {hasMerklRewards ? (
          <ClaimButton
            userAddress={address as Address}
            rewardToken={epoch.rewardToken as Address}
          />
        ) : (
          <button
            disabled
            className='bg-ic-gray-600 text-ic-gray-400 cursor-not-allowed rounded-full px-4 py-1 text-xs font-medium'
          >
            Processing...
          </button>
        )}
      </div>
    </div>
  )
}
