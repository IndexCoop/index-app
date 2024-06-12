import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { MouseEventHandler, ReactNode } from 'react'

import { SortDirection } from '@/app/products/types/sort'

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
        'text-ic-gray-600 hover:text-ic-gray-800 min-w-[116px] cursor-pointer items-center px-2 text-center text-sm font-medium',
        className,
      )}
      onClick={onClick}
    >
      {children}
      {sortDirection === SortDirection.DESC ? (
        <ChevronDownIcon className='ml-1 inline-block h-4 w-4' />
      ) : null}
      {sortDirection === SortDirection.ASC ? (
        <ChevronUpIcon className='ml-1 inline-block h-4 w-4' />
      ) : null}
    </div>
  )
}
