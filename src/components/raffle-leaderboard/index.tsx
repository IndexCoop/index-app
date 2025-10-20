'use client'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Fragment, useMemo } from 'react'

import { SkeletonLoader } from '@/lib/utils/skeleton-loader'

import { getLeaderboardColumns } from './columns'
import { type LeaderboardEntry } from './types'

type RaffleLeaderboardTableProps = {
  data: LeaderboardEntry[]
  isLoading?: boolean
  epoch: {
    id: number
    startDate: string
    endDate: string
    drawCompleted: boolean
    rewardToken: string | null
  }
}

export function RaffleLeaderboardTable({
  data,
  isLoading,
  epoch,
}: RaffleLeaderboardTableProps) {
  const columns = useMemo(() => getLeaderboardColumns({ epoch }), [epoch])

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='relative flex w-full flex-col gap-1'>
      {/* Header */}
      <div className='w-full'>
        {table.getHeaderGroups().map((headerGroup) => (
          <div
            className='text-ic-gray-400 flex w-full pl-4 pr-8 text-left text-xs font-normal'
            key={headerGroup.id}
          >
            {headerGroup.headers.map((header) =>
              header.isPlaceholder ? (
                <Fragment key={header.id} />
              ) : (
                <Fragment key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </Fragment>
              ),
            )}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className='flex max-h-[500px] min-h-[232px] w-full flex-col gap-[4px] overflow-y-auto rounded-md pb-4'>
        {isLoading ? (
          <div className='flex w-full flex-col gap-3 px-4 py-2'>
            {[1, 2, 3, 4, 5].map((n) => (
              <SkeletonLoader key={n} className='h-12 w-full rounded-lg' />
            ))}
          </div>
        ) : table.getRowModel().rows.length === 0 ? (
          <div className='text-ic-white t text-md flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold'>
            No participants yet
          </div>
        ) : (
          table.getRowModel().rows.map((row) => (
            <div
              className='text-ic-white flex h-[41px] w-full items-center justify-between rounded bg-[#061010] py-3 pl-4 pr-8 text-sm'
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <Fragment key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Fragment>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
