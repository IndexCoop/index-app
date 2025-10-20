'use client'

import { getTokenByChainAndAddress } from '@indexcoop/tokenlists'
import { useMemo } from 'react'
import { formatUnits } from 'viem'

import { GetApiV2RaffleLeaderboardEpochid200 } from '@/gen'

type RafflePrizesCardProps = {
  epoch: GetApiV2RaffleLeaderboardEpochid200['epoch']
}

type Prize = {
  tier: string
  numWinners: number
  amount: string
  amountFormatted: string
}

export function RafflePrizesCard({ epoch }: RafflePrizesCardProps) {
  const { prizeConfig, prizeDistribution, rewardToken } = epoch

  // Get the reward token from tokenlist (assuming mainnet chainId = 1)
  const token = useMemo(() => {
    if (!rewardToken) return null
    return getTokenByChainAndAddress(1, rewardToken)
  }, [rewardToken])

  const tokenSymbol = token?.symbol ?? 'INDEX'
  const tokenDecimals = token?.decimals ?? 18

  // Combine prize config and distribution into a usable format
  const prizes = useMemo<Prize[]>(() => {
    if (!prizeConfig || !prizeDistribution) return []

    return Object.entries(prizeConfig).map(([tier, numWinners]) => {
      const amountWei = prizeDistribution[tier] ?? '0'
      const amountFormatted = formatUnits(BigInt(amountWei), tokenDecimals)

      return {
        tier,
        numWinners,
        amount: amountWei,
        amountFormatted: Number(amountFormatted).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }),
      }
    })
  }, [prizeConfig, prizeDistribution, tokenDecimals])

  return (
    <div className='flex w-full flex-col gap-7 self-stretch rounded-lg bg-[#061010] p-6'>
      <h2 className='text-ic-gray-50 text-sm font-bold'>Prizes</h2>

      <div className='flex gap-3'>
        {prizes.map((prize) => (
          <div
            key={prize.tier}
            className='flex flex-1 flex-col items-start gap-2'
          >
            <span className='bg-ic-gray-200 text-ic-black rounded-full px-3 py-1 text-xs'>
              {prize.numWinners}x
            </span>
            <div className='text-ic-gray-200 text-xs'>
              {prize.amountFormatted} {tokenSymbol}
            </div>
          </div>
        ))}
      </div>

      <p className='text-ic-gray-500 text-xs'>
        Winners are drawn at epoch end. Odds are proportional to your ticket
        share.
      </p>
    </div>
  )
}
