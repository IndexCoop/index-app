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

      <div className='grid grid-cols-[auto_1fr] gap-x-3'>
        {/* Top left - Your tickets & odds */}
        <div
          className='flex w-52 flex-col gap-1.5 space-y-1 rounded-t-2xl border border-[#659A9A] px-4 py-3'
          style={{
            background:
              'linear-gradient(275deg, #132023 -16.13%, #1C3C44 102.73%)',
          }}
        >
          <div className='flex items-center justify-between'>
            <div className='text-ic-gray-400 text-xs font-medium'>
              Your tickets
            </div>
            <div className='text-ic-gray-500 text-xs font-medium'>
              Your odds
            </div>
          </div>
          <div className='flex items-end justify-between'>
            <div className='flex items-center gap-2'>
              <Image
                src='/assets/ticket-icon.png'
                alt='tickets'
                width={24}
                height={20}
              />
              <span className='text-ic-gray-50 text-xl font-bold'>
                {isLoading ? <LoadingDots /> : userRaffleData?.tickets}
              </span>
            </div>
            <div className='text-ic-gray-400 text-lg font-light'>
              {isLoading ? <LoadingDots /> : `${userOdds}%`}
            </div>
          </div>
        </div>

        {/* Top right - Maturing tickets */}
        <div className='flex flex-col justify-center gap-3 rounded-2xl bg-[#132023] px-4 py-3'>
          <div className='text-ic-gray-600 text-xs font-medium'>
            Maturing tickets
          </div>
          <div className='flex items-center gap-2'>
            <Image
              className='opacity-50'
              src='/assets/ticket-icon.png'
              alt='tickets'
              width={24}
              height={20}
            />
            <span className='text-ic-gray-500 text-xl font-bold'>
              {isLoading ? <LoadingDots /> : userRaffleData?.maturingTickets}
            </span>
          </div>
        </div>

        {/* Bottom left - Breakdown */}
        <div className='flex w-52 flex-col gap-1.5 rounded-b-2xl border-b border-l border-r border-[#4E6060] px-1.5 py-3'>
          <div className='text-ic-gray-700 px-3 text-left text-[10px]'>
            Breakdown
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center justify-between px-3'>
              <span className='text-ic-gray-400 text-xs font-medium'>
                From trading
              </span>
              <div className='flex items-center gap-1'>
                <Image
                  src='/assets/ticket-icon.png'
                  alt='tickets'
                  width={15}
                  height={12}
                />
                <span className='text-ic-gray-50 text-xs font-bold'>
                  {isLoading ? (
                    <LoadingDots />
                  ) : (
                    (userRaffleData?.tickets ?? 0) -
                    (userRaffleData?.referralTickets ?? 0)
                  )}
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between px-3'>
              <span className='text-ic-gray-400 text-xs font-medium'>
                From referrals
              </span>
              <div className='flex items-center gap-1'>
                <Image
                  src='/assets/ticket-icon.png'
                  alt='tickets'
                  width={15}
                  height={12}
                />
                <span className='text-ic-gray-50 text-xs font-bold'>
                  {isLoading ? (
                    <LoadingDots />
                  ) : (
                    (userRaffleData?.referralTickets ?? 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom right - Info text */}
        <div className='px-2 pt-4'>
          <p className='text-ic-gray-500 text-[10px] leading-relaxed'>
            Tickets mature after a position has been held for at least 24 hours.
          </p>
        </div>
      </div>
    </div>
  )
}
