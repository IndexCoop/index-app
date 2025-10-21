import { getTokenByChainAndAddress } from '@indexcoop/tokenlists'
import { createColumnHelper } from '@tanstack/react-table'
import id from 'lodash/identity'
import Image from 'next/image'
import { Address, formatUnits } from 'viem'

import { useWallet } from '@/lib/hooks/use-wallet'
import { cn } from '@/lib/utils/tailwind'

import { ClaimButton } from './claim-button'
import type { LeaderboardEntry } from './types'

const columnHelper = createColumnHelper<LeaderboardEntry>()

type ColumnOptions = {
  epoch: {
    id: number
    startDate: string
    endDate: string
    drawCompleted: boolean
    rewardToken: string | null
  }
}

export const getLeaderboardColumns = (options: ColumnOptions) => [
  columnHelper.accessor(id, {
    id: 'raffle-leaderboard:rank',
    header: () => (
      <div className='text-ic-gray-400 flex-[0.5] pl-4 text-left text-xs'>
        #
      </div>
    ),
    cell: (row) => {
      const rank = row.row.original.rank
      return (
        <div className={cn('flex-[0.5] pl-4 text-left text-xs')}>{rank}</div>
      )
    },
  }),
  columnHelper.accessor(id, {
    id: 'raffle-leaderboard:userAddress',
    header: () => (
      <div className='text-ic-gray-400 flex-1 text-left text-xs'>Wallet</div>
    ),
    cell: (row) => {
      const address = row.row.original.userAddress
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
  columnHelper.accessor(id, {
    id: 'raffle-leaderboard:tickets',
    header: () => {
      // Get the reward token from tokenlist (assuming mainnet chainId = 1)
      const rewardToken = options.epoch.rewardToken
        ? getTokenByChainAndAddress(1, options.epoch.rewardToken)
        : null
      const tokenSymbol = rewardToken?.symbol ?? 'INDEX'

      return (
        <div className='text-ic-gray-400 flex-[0.5] text-center text-xs'>
          {options.epoch.drawCompleted ? `${tokenSymbol} won` : '# of tickets'}
        </div>
      )
    },
    cell: (row) => {
      const entry = row.row.original

      if (options.epoch.drawCompleted) {
        // amount is a wei string from the API - format it to human readable
        const rewardToken = options.epoch.rewardToken
          ? getTokenByChainAndAddress(1, options.epoch.rewardToken)
          : null
        const tokenDecimals = rewardToken?.decimals ?? 18
        const amountWei = entry.amount ?? '0'
        const amountFormatted = formatUnits(BigInt(amountWei), tokenDecimals)
        const displayAmount = Number(amountFormatted).toLocaleString(
          undefined,
          {
            maximumFractionDigits: 0,
          },
        )

        return (
          <div className='flex flex-[0.5] items-center justify-center gap-2'>
            <div className='text-xs'>{displayAmount}</div>
          </div>
        )
      }

      return (
        <div className='flex flex-[0.5] items-center justify-center gap-2'>
          <Image
            src='/assets/ticket-icon.png'
            alt='tickets'
            width={20}
            height={20}
          />
          <div className='text-ic-blue-300 text-xs'>
            {entry.tickets?.toLocaleString()}
          </div>
        </div>
      )
    },
  }),
  columnHelper.display({
    id: 'raffle-leaderboard:odds',
    header: () => (
      <div className='text-ic-gray-400 flex-[0.4] text-right text-xs'>
        {options.epoch.drawCompleted ? 'Claim via Merkl' : 'First prize odds'}
      </div>
    ),
    cell: (row) => {
      if (options.epoch.drawCompleted) {
        const userAddress = row.row.original.userAddress
        return (
          <ClaimButton
            userAddress={userAddress as Address}
            rewardToken={options.epoch.rewardToken as Address}
          />
        )
      }

      const tickets = row.row.original.tickets
      const totalTickets = row.table
        .getRowModel()
        .rows.reduce((sum, r) => sum + (r.original?.tickets ?? 0), 0)

      const odds = totalTickets > 0 ? ((tickets ?? 0) / totalTickets) * 100 : 0

      return (
        <div className='text-ic-blue-300 flex-[0.4] text-right text-xs'>
          {odds.toFixed(2)}%
        </div>
      )
    },
  }),
]
