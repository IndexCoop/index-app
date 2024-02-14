import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { MouseEventHandler, ReactNode } from 'react'
import { SortDirection } from '@/app/(homepage)/types/sort'

type Props = {
  children: ReactNode
  className?: string
  onClick?: MouseEventHandler<HTMLTableCellElement>
  sortDirection: string | null
}

export function ProductColHeader({
  children,
  className,
  onClick,
  sortDirection,
}: Props) {
  return (
    <div
      className={clsx(
        'text-ic-gray-600 px-2 text-sm font-medium cursor-pointer text-center items-center min-w-[116px] hover:text-ic-gray-800',
        className,
      )}
      onClick={onClick}
    >
      {children}
      {sortDirection === SortDirection.DESC ? (
        <ChevronDownIcon className='ml-1 h-4 w-4 inline-block' />
      ) : null}
      {sortDirection === SortDirection.ASC ? (
        <ChevronUpIcon className='ml-1 h-4 w-4 inline-block' />
      ) : null}
    </div>
  )
}
