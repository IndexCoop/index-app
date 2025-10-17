import { Button } from '@headlessui/react'

export function RaffleHowToCard() {
  return (
    <div className='flex w-full flex-col gap-3 self-stretch rounded-lg bg-[#061010] p-6'>
      <h2 className='text-ic-gray-50 text-sm font-bold'>
        How to collect tickets
      </h2>

      <div className='text-ic-gray-400 flex flex-col gap-3 text-xs'>
        <p>
          Earn{' '}
          <span className='text-ic-gray-50 font-semibold'>
            1 raffle ticket per $1,000
          </span>{' '}
          equivalent in Index Coop leverage token mints held for at least 24
          hours. 50 ticket cap per wallet.
        </p>

        <ul className='flex list-disc flex-col gap-2 pl-5'>
          <li>
            Tickets accrue{' '}
            <span className='text-ic-gray-50 font-semibold'>
              after your mint has been held ≥24h
            </span>
            . Redemptions before 24h do not earn tickets.
          </li>
          <li>
            Epochs run every{' '}
            <span className='text-ic-gray-50 font-semibold'>
              14 days at 00:00 UTC
            </span>{' '}
            from the announced start day.
          </li>
          <li>
            Single, cross-chain leaderboard - your tickets are aggregated across
            supported chains.
          </li>
          <li>
            Winners have a{' '}
            <span className='text-ic-gray-50 font-semibold'>
              one month claim window
            </span>{' '}
            to claim INDEX rewards via Merkl.
          </li>
        </ul>
      </div>

      <Button
        className='ml-auto shrink-0 whitespace-nowrap rounded-full bg-teal-100 px-5 py-1 text-xs transition-colors duration-500 hover:bg-teal-200'
        as='a'
        target='_blank'
        href='https://indexcoop.com/blog/trading-raffle'
      >
        Learn more
      </Button>
    </div>
  )
}
