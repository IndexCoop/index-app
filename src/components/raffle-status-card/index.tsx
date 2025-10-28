'use client'

import Image from 'next/image'

import { GetApiV2RaffleLeaderboardEpochid200 } from '@/gen'
import { useRaffleTickets } from '@/lib/hooks/use-raffle-tickets'
import { useWallet } from '@/lib/hooks/use-wallet'

type RaffleStatusCardProps = {
  leaderboard: GetApiV2RaffleLeaderboardEpochid200['leaderboard']
  epoch?: GetApiV2RaffleLeaderboardEpochid200['epoch']
}

const LoadingDots = () => (
  <span className='inline-flex gap-[1px]'>
    <span className='animate-[pulse_1.4s_ease-in-out_infinite]'>.</span>
    <span className='animate-[pulse_1.4s_ease-in-out_0.2s_infinite]'>.</span>
    <span className='animate-[pulse_1.4s_ease-in-out_0.4s_infinite]'>.</span>
  </span>
)

export function RaffleStatusCard({
  leaderboard,
  epoch,
}: RaffleStatusCardProps) {
  const { address } = useWallet()

  const { data: userRaffleData, isLoading } = useRaffleTickets(address)

  const userEntry = leaderboard.find(
    (entry) => entry.userAddress.toLowerCase() === address?.toLowerCase(),
  )

  const totalTickets = leaderboard.reduce(
    (sum, entry) => sum + (entry.tickets ?? 0),
    0,
  )
  const userTickets = userEntry?.tickets ?? 0
  const userOdds =
    totalTickets > 0 ? ((userTickets / totalTickets) * 100).toFixed(2) : '0.00'

  // Show "Raffle Ended" state when draw is completed
  if (epoch?.drawCompleted) {
    return (
      <div className='flex w-full flex-col gap-4 self-stretch rounded-lg border border-[#77A7A7] bg-[#061010] p-6'>
        <h2 className='text-ic-gray-50 text-sm font-bold'>Raffle status</h2>

        <div
          className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#659A9A] p-8'
          style={{
            background:
              'linear-gradient(275deg, #132023 -16.13%, #1C3C44 102.73%)',
          }}
        >
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-[#77A7A7]' />
            <span className='text-ic-gray-400 text-sm font-semibold'>
              DRAW COMPLETED
            </span>
          </div>

          <h3 className='text-ic-blue-300 text-center text-2xl font-bold'>
            Raffle Ended
          </h3>

          <p className='text-ic-gray-400 text-center text-xs'>
            Winners have been drawn. Check the leaderboard to see if you won!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex w-full flex-col gap-3 self-stretch rounded-lg border border-[#77A7A7] bg-[#061010] p-6'>
      <h2 className='text-ic-gray-50 text-sm font-bold'>Your raffle status</h2>

      <div className='flex gap-3'>
        <div
          className='flex shrink-0 gap-6 rounded-2xl border border-[#659A9A] p-4 md:gap-12'
          style={{
            background:
              'linear-gradient(275deg, #132023 -16.13%, #1C3C44 102.73%)',
          }}
        >
          <div className='flex flex-1 flex-col justify-center gap-1'>
            <div className='text-ic-gray-400 whitespace-nowrap text-xs'>
              Your tickets
            </div>
            <div className='flex items-center gap-1'>
              <Image
                src='/assets/ticket-icon.png'
                alt='tickets'
                width={20}
                height={20}
              />
              <span className='text-ic-gray-50 text-lg font-bold'>
                {isLoading ? <LoadingDots /> : userRaffleData?.tickets}
              </span>
            </div>
          </div>

          <div className='flex flex-1 flex-col justify-center gap-1'>
            <div className='text-ic-gray-400 text-xs'>Your odds</div>
            <div className='text-ic-gray-400 text-xl'>
              {isLoading ? <LoadingDots /> : `${userOdds}%`}
            </div>
          </div>
        </div>

        <div className='flex flex-1 shrink-0 flex-col justify-center gap-1 rounded-2xl bg-[#132023] p-4'>
          <div className='text-ic-gray-600 text-xs'>Maturing tickets</div>
          <div className='flex items-center gap-1 text-lg font-bold'>
            <Image
              className='opacity-50'
              src='/assets/ticket-icon.png'
              alt='tickets'
              width={20}
              height={20}
            />
            <span className='text-ic-gray-500 text-xl font-bold'>
              {isLoading ? <LoadingDots /> : userRaffleData?.maturingTickets}
            </span>
          </div>
        </div>
      </div>

      <p className='text-ic-gray-500 text-xs'>
        Tickets mature after a position has been held for at least 24 hours.
      </p>
    </div>
  )
}
