import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'

import { useWallet } from '@/lib/hooks/use-wallet'
import { cn } from '@/lib/utils/tailwind'

import type { LeaderboardEntry } from './types'

const columnHelper = createColumnHelper<LeaderboardEntry>()

export const leaderboardColumns = [
  columnHelper.accessor('rank', {
    id: 'raffle-leaderboard:rank',
    header: () => (
      <div className='text-ic-gray-400 flex-[0.5] pl-4 text-left text-xs'>
        #
      </div>
    ),
    cell: (row) => {
      const rank = row.getValue()
      return (
        <div className={cn('flex-[0.5] pl-4 text-left text-xs')}>{rank}</div>
      )
    },
  }),
  columnHelper.accessor('userAddress', {
    id: 'raffle-leaderboard:userAddress',
    header: () => (
      <div className='text-ic-gray-400 flex-1 text-left text-xs'>Wallet</div>
    ),
    cell: (row) => {
      const address = row.getValue()
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { address: walletAddress } = useWallet()
      const isCurrentUser =
        walletAddress?.toLowerCase() === address.toLowerCase()

      return (
        <div className='flex flex-1 items-center gap-2 text-left'>
          <span
            className={cn(
              'font-mono',
              isCurrentUser && 'text-ic-blue-300 font-bold',
            )}
          >
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          {isCurrentUser && (
            <span className='bg-ic-blue-300 rounded px-2 py-0.5 text-sm text-black'>
              You
            </span>
          )}
        </div>
      )
    },
  }),
  columnHelper.accessor('tickets', {
    id: 'raffle-leaderboard:tickets',
    header: () => (
      <div className='text-ic-gray-400 flex-[0.5] text-center text-xs'>
        # of tickets
      </div>
    ),
    cell: (row) => {
      const tickets = row.getValue()
      return (
        <div className='flex flex-[0.5] items-center justify-center gap-2'>
          <Image
            src='/assets/ticket-icon.png'
            alt='tickets'
            width={20}
            height={20}
          />
          <div className='text-ic-blue-300 text-xs'>
            {tickets?.toLocaleString()}
          </div>
        </div>
      )
    },
  }),
  columnHelper.display({
    id: 'raffle-leaderboard:odds',
    header: () => (
      <div className='text-ic-gray-400 flex-[0.4] text-right text-xs'>
        First prize odds
      </div>
    ),
    cell: (row) => {
      const tickets = row.row.original.tickets
      const totalTickets = row.table
        .getRowModel()
        .rows.reduce((sum, r) => sum + (r.original?.tickets ?? 0), 0)
      const odds = totalTickets > 0 ? (tickets ?? 0 / totalTickets) * 100 : 0

      return (
        <div className='text-ic-blue-300 flex-[0.4] text-right text-xs'>
          {odds.toFixed(2)}%
        </div>
      )
    },
  }),
]
