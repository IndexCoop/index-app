'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { EpochSelector } from '@/components/raffle/epoch-selector'
import { RaffleHowToCard } from '@/components/raffle-how-to-card'
import { RaffleLeaderboardTable } from '@/components/raffle-leaderboard'
import { UserWinnerRow } from '@/components/raffle-leaderboard/user-winner-row'
import { RafflePrizesCard } from '@/components/raffle-prizes-card'
import { RaffleReferralCard } from '@/components/raffle-referral-card'
import { RaffleStatusCard } from '@/components/raffle-status-card'
import { RaffleStatusWrapper } from '@/components/raffle-status-wrapper'
import {
  getApiV2RaffleEpochs,
  getApiV2RaffleLeaderboardEpochid,
  type GetApiV2RaffleEpochs200,
} from '@/gen'
import { useEpochCountdown } from '@/lib/hooks/use-epoch-countdown'
import { selectDefaultEpoch } from '@/lib/utils/raffle'
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

  useEffect(() => {
    if (selectableEpochs.length > 0 && !selectedEpoch) {
      const defaultEpoch = selectDefaultEpoch(selectableEpochs)
      if (defaultEpoch) {
        setSelectedEpoch(defaultEpoch)
      }
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

  const isUpcoming =
    selectedEpoch && new Date() < new Date(selectedEpoch.startDate)
  const countdownDate = isUpcoming
    ? selectedEpoch?.startDate
    : selectedEpoch?.endDate

  const timeLeft = useEpochCountdown(
    epoch?.drawCompleted ? null : countdownDate,
  )

  if (isLoadingEpochs || !selectedEpoch) {
    return (
      <div className='mx-auto max-w-7xl px-3 py-6 sm:px-6 md:pt-20'>
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
    <div className='mx-auto max-w-7xl px-3 py-6 sm:px-6 md:pt-20'>
      <div className='flex flex-wrap gap-6'>
        <div className='flex-1'>
          <div className='mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
            <div className='flex items-center gap-4'>
              <h1 className='text-ic-gray-50 text-sm font-bold'>
                {epoch?.drawCompleted ? 'Winners' : 'Live Leaderboard'}
              </h1>
              <EpochSelector
                epochs={selectableEpochs}
                selectedEpoch={selectedEpoch}
                onEpochChange={setSelectedEpoch}
              />
            </div>
            {!epoch?.drawCompleted && timeLeft && (
              <p className='text-ic-blue-300 text-xs font-semibold sm:ml-auto'>
                {isUpcoming ? 'Starts' : 'Ends'} in {timeLeft}
              </p>
            )}
          </div>
          {epoch && (
            <>
              <UserWinnerRow />
              <RaffleLeaderboardTable
                data={leaderboard}
                epoch={epoch}
                isLoading={isLoadingLeaderboard}
              />
            </>
          )}
        </div>
        <div className='flex max-w-[95vw] flex-col gap-6 md:max-w-[400px]'>
          <RaffleStatusWrapper>
            <RaffleStatusCard leaderboard={leaderboard} epoch={epoch} />
            <RaffleReferralCard />
          </RaffleStatusWrapper>
          {epoch && <RafflePrizesCard epoch={epoch} />}
          <RaffleHowToCard />
        </div>
      </div>
    </div>
  )
}
