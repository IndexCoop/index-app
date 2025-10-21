'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { RaffleHowToCard } from '@/components/raffle-how-to-card'
import { RaffleLeaderboardTable } from '@/components/raffle-leaderboard'
import { RafflePrizesCard } from '@/components/raffle-prizes-card'
import { RaffleStatusCard } from '@/components/raffle-status-card'
import { EpochSelector } from '@/components/raffle/epoch-selector'
import {
  getApiV2RaffleEpochs,
  getApiV2RaffleLeaderboardEpochid,
  type GetApiV2RaffleEpochs200,
} from '@/gen'
import { useMerklRewards } from '@/lib/hooks/use-merkl-rewards'
import { SkeletonLoader } from '@/lib/utils/skeleton-loader'

type EpochWithName = GetApiV2RaffleEpochs200[number] & { name: string }

export default function LeaderboardPage() {
  // Fetch all epochs
  const { data: epochsData, isLoading: isLoadingEpochs } = useQuery({
    queryKey: ['raffle-epochs'],
    queryFn: async () => {
      const response = await getApiV2RaffleEpochs({})
      return response.data ?? []
    },
  })

  // Filter out silent epochs and sort by date descending
  const selectableEpochs = useMemo<EpochWithName[]>(() => {
    if (!epochsData) return []
    return epochsData
      .filter((epoch) => !epoch.silent)
      .map((epoch) => ({
        ...epoch,
        name: epoch.name,
      }))
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
  }, [epochsData])

  const [selectedEpoch, setSelectedEpoch] = useState<EpochWithName | null>(null)

  // Set initial epoch when data loads
  useEffect(() => {
    if (selectableEpochs.length > 0 && !selectedEpoch) {
      setSelectedEpoch(selectableEpochs[0])
    }
  }, [selectableEpochs, selectedEpoch])

  // Fetch leaderboard for selected epoch
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ['raffle-leaderboard', selectedEpoch?.id],
    queryFn: async () => {
      if (!selectedEpoch) return null
      const response = await getApiV2RaffleLeaderboardEpochid(
        { epochId: selectedEpoch.id },
        { limit: 100 },
      )
      return response.data
    },
    enabled: !!selectedEpoch,
  })

  const epoch = leaderboardData?.epoch
  const leaderboard = leaderboardData?.leaderboard ?? []

  const { data: rewards } = useMerklRewards(
    '0x0954906da0Bf32d5479e25f46056d22f08464cab',
  )

  if (isLoadingEpochs || !selectedEpoch) {
    return (
      <div className='mx-auto max-w-7xl p-6 md:pt-20'>
        <div className='flex flex-wrap gap-6'>
          <div className='flex-1'>
            <div className='mb-7 flex items-center gap-4'>
              <SkeletonLoader className='h-6 w-32' />
              <SkeletonLoader className='h-9 w-40' />
            </div>
            <SkeletonLoader className='h-[500px] w-full' />
          </div>
          <div className='flex max-w-[400px] flex-col gap-6'>
            <SkeletonLoader className='h-[200px] w-full' />
            <SkeletonLoader className='h-[300px] w-full' />
            <SkeletonLoader className='h-[400px] w-full' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-7xl p-6 md:pt-20'>
      <div className='flex flex-wrap gap-6'>
        <div className='flex-1'>
          <div className='mb-7 flex items-center gap-4'>
            <h1 className='text-ic-gray-50 text-sm font-bold'>
              {epoch?.drawCompleted ? 'Winners' : 'Live Leaderboard'}
            </h1>
            <EpochSelector
              epochs={selectableEpochs}
              selectedEpoch={selectedEpoch}
              onEpochChange={setSelectedEpoch}
            />
          </div>
          {epoch && (
            <RaffleLeaderboardTable
              data={leaderboard}
              epoch={epoch}
              isLoading={isLoadingLeaderboard}
            />
          )}
        </div>
        <div className='flex max-w-[400px] flex-col gap-6'>
          <RaffleStatusCard leaderboard={leaderboard} />
          {epoch && <RafflePrizesCard epoch={epoch} />}
          <RaffleHowToCard />
        </div>
      </div>
    </div>
  )
}
