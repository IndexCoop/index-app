import { RaffleHowToCard } from '@/components/raffle-how-to-card'
import { RaffleLeaderboardTable } from '@/components/raffle-leaderboard'
import { RafflePrizesCard } from '@/components/raffle-prizes-card'
import { RaffleStatusCard } from '@/components/raffle-status-card'
import { getApiV2RaffleLeaderboardEpochid } from '@/gen'

type LeaderboardPageProps = {
  params: {
    epochId: string
  }
}

export default async function LeaderboardPage({
  params,
}: LeaderboardPageProps) {
  const epochId = parseInt(params.epochId, 10)

  const response = await getApiV2RaffleLeaderboardEpochid(
    { epochId },
    { limit: 100 },
  )

  const data = response.data!
  const leaderboard = data.leaderboard ?? []

  return (
    <div className='mx-auto max-w-7xl p-6 md:pt-20'>
      <div className='flex flex-wrap gap-6'>
        <div className='flex-1'>
          <h1 className='text-ic-gray-50 mb-7 text-sm font-bold'>
            Live Leaderboard <span className='mx-4'>•</span> Epoch {epochId}
          </h1>
          <RaffleLeaderboardTable data={leaderboard} />
        </div>
        <div className='flex max-w-[400px] flex-col gap-6'>
          <RaffleStatusCard leaderboard={leaderboard} />
          <RafflePrizesCard epoch={data.epoch} />
          <RaffleHowToCard />
        </div>
      </div>
    </div>
  )
}
