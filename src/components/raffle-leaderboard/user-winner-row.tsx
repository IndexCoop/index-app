'use client'

import { getTokenByChainAndAddress } from '@indexcoop/tokenlists'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { formatUnits } from 'viem'

import { useClaimableRewards } from '@/lib/hooks/use-claimable-rewards'
import { useMerklRewards } from '@/lib/hooks/use-merkl-rewards'
import { useWallet } from '@/lib/hooks/use-wallet'

import { ClaimButton } from './claim-button'

import type { Address } from 'viem'

function TokenRow({
  rewardToken,
  totalClaimable,
  onError,
}: {
  rewardToken: string
  totalClaimable: string
  onError: (error: string | null) => void
}) {
  const { address } = useWallet()
  const { data: rewards = [], refetch } = useMerklRewards(
    rewardToken as Address,
  )

  const token = getTokenByChainAndAddress(1, rewardToken)
  const tokenDecimals = token?.decimals ?? 18
  const tokenSymbol = token?.symbol ?? 'TOKEN'

  const hasMerklRewards = rewards.length > 0

  // Calculate display amount
  const displayTotal = hasMerklRewards
    ? (() => {
        const totalRewards = rewards.reduce(
          (sum, reward) => sum + BigInt(reward?.amount ?? 0),
          BigInt(0),
        )
        const formatted = formatUnits(totalRewards, tokenDecimals)
        return Number(formatted).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })
      })()
    : (() => {
        const formatted = formatUnits(BigInt(totalClaimable), tokenDecimals)
        return Number(formatted).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })
      })()

  return (
    <div className='border-ic-gray-700 flex flex-col gap-2 rounded-lg border bg-gradient-to-br from-[#0a1414] to-[#0d1f1f] p-2.5 sm:p-4'>
      <div className='flex items-center gap-3'>
        {/* Amount, Token Symbol, and Label in one row */}
        <div className='flex flex-1 items-center gap-2'>
          <span className='text-ic-blue-300 text-lg font-bold'>
            {displayTotal}
          </span>
          <span className='text-ic-white text-base font-semibold'>
            {tokenSymbol}
          </span>
          <span className='text-ic-gray-400 text-sm'>
            {hasMerklRewards ? 'Claimable' : 'Pending'}
          </span>
        </div>

        {/* Claim Button or Processing */}
        <div className='flex-shrink-0'>
          {hasMerklRewards ? (
            <ClaimButton
              userAddress={address as Address}
              rewardToken={rewardToken as Address}
              rewards={rewards}
              refetch={refetch}
              onError={onError}
            />
          ) : (
            <button
              disabled
              className='bg-ic-gray-700 text-ic-gray-400 cursor-not-allowed rounded-full px-4 py-1 text-xs font-medium'
            >
              Processing...
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function UserWinnerRow() {
  const { address } = useWallet()
  const tokensToShow = useClaimableRewards(address)
  const [claimError, setClaimError] = useState<string | null>(null)

  // Check if any token is processing (has unclaimed but no Merkl yet)
  const hasProcessingRewards = tokensToShow.some(
    (token) => token.hasUnclaimedRewards && !token.hasMerklRewards,
  )

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (claimError) {
      const timer = setTimeout(() => {
        setClaimError(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [claimError])

  // Show if user has any tokens (either in database or Merkl)
  if (!address || tokensToShow.length === 0) {
    return null
  }

  return (
    <div className='border-ic-gray-600 mb-4 flex w-full flex-col rounded-xl border bg-gradient-to-br from-[#061414] to-[#0a1f1f] p-3 shadow-2xl sm:mb-6 sm:p-5'>
      {/* Header: Wallet Info */}
      <div className='border-ic-gray-700 mb-3 border-b pb-3 sm:mb-4 sm:pb-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-ic-blue-300/10 flex h-10 w-10 items-center justify-center rounded-full'>
            <Image
              src='/assets/ticket-icon.png'
              alt='tickets'
              width={24}
              height={24}
            />
          </div>
          <div>
            <div className='text-ic-gray-400 text-xs font-medium uppercase tracking-wide'>
              Your Rewards
            </div>
            <div className='text-ic-white flex items-center gap-2'>
              <span className='font-mono text-sm font-semibold'>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          </div>
        </div>
        {/* Processing message if any token is waiting for Merkl */}
        {hasProcessingRewards && (
          <div className='text-ic-gray-400 mt-2 text-xs'>
            Rewards will be claimable within 24 hours
          </div>
        )}
      </div>

      {/* Token Rows */}
      <div className='flex flex-col gap-3'>
        {tokensToShow.map((token) => (
          <TokenRow
            key={token.rewardToken}
            rewardToken={token.rewardToken}
            totalClaimable={token.totalClaimable}
            onError={setClaimError}
          />
        ))}
      </div>

      {/* Error Message */}
      {claimError && (
        <div className='mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400'>
          {claimError}
        </div>
      )}
    </div>
  )
}
