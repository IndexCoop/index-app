import { flexRender } from '@tanstack/react-table'
import { Fragment } from 'react'

import { EnrichedToken } from '@/app/leverage/types'
import { SkeletonLoader } from '@/lib/utils/skeleton-loader'

import type { RowData, Table } from '@tanstack/react-table'

type TableProps = {
  table: Table<any>
  emptyText: string
  isFetching?: boolean
}

export const TableRenderer = ({ table, emptyText, isFetching }: TableProps) => {
  return (
    <div className='flex w-full flex-col gap-1'>
      <div className='w-full'>
        {table.getHeaderGroups().map((headerGroup) => (
          <div
            className='text-ic-gray-400 flex w-full px-4 text-left text-xs font-normal'
            key={headerGroup.id}
          >
            {headerGroup.headers.map((header) =>
              header.isPlaceholder ? (
                <></>
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
      <div className='flex w-full flex-col gap-1'>
        {isFetching ? (
          <div className='flex w-full flex-col gap-3 px-4 py-2'>
            {[1, 2, 3].map((n) => (
              <SkeletonLoader key={n} className='h-12 w-full rounded-lg' />
            ))}
          </div>
        ) : table.getRowModel().rows.length === 0 ? (
          <div className='text-ic-white t text-md flex w-full items-center justify-center rounded-lg bg-[#1A2A2B] px-4 py-3 text-sm font-semibold'>
            {emptyText}
          </div>
        ) : (
          table.getRowModel().rows.map((row) => (
            <div
              className='text-ic-white flex w-full items-center rounded-lg bg-[#1A2A2B] px-4 py-3 text-left text-xs'
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

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    _?: TData & never // to ignore unused error for now
    tokens: Record<string, EnrichedToken>
    adjustPosition: (mint: boolean, token: EnrichedToken) => void
  }
}
