'use client'

import Image from 'next/image'
import clsx from 'clsx'
import Link from 'next/link'
import { LoadingSkeleton } from '@/app/(homepage)/components/loading-skeleton'
import { ProductRowItemProps } from '@/app/(homepage)/components/product-row-item'
import { ProductType } from '@/app/(homepage)/types/product'
import {
  formatPercentage,
  formatPrice,
  formatTvl,
} from '@/app/(homepage)/utils/formatters'

const cellClassName = 'text-ic-gray-600 text-sm font-medium min-w-[116px]'

export function ProductRowItemDesktop({
  isLoading,
  product: { logoURI, symbol, name, theme, type, price, delta, apy, tvl },
}: ProductRowItemProps) {
  return (
    <Link
      className='h-[60px] odd:bg-[#FBFCFC] odd:border-[#FBFCFC] even:border-transparent hover:bg-ic-gray-100 hover:cursor-pointer hidden md:flex items-center justify-between min-w-fit'
      href={`/swap/eth/${symbol!.toLowerCase()}`}
    >
      <div
        className={clsx(
          cellClassName,
          'flex !min-w-[400px] max-w-[460px] pl-6',
        )}
      >
        <div className='mr-2 overflow-hidden rounded-full'>
          <Image src={logoURI!} alt={`${symbol} logo`} height={30} width={30} />
        </div>
        <div className='my-auto'>
          <span className='text-ic-gray-950 mr-4 font-semibold'>{name}</span>
          <span className='text-ic-gray-400'>{symbol}</span>
        </div>
      </div>
      <div className={cellClassName}>
        <div
          className={clsx(
            'rounded-2xl px-4 py-1 w-24 text-center border border-ic-gray-500 mx-auto',
            {
              'bg-[#E7F2FF]': type === ProductType.LEVERAGE,
              'bg-[#F4ECFF]': type === ProductType.SECTOR,
              'bg-[#FEEFF7]': type === ProductType.YIELD,
            },
          )}
        >
          {type}
        </div>
      </div>
      <div className={cellClassName}>
        <div className='bg-ic-gray-300 rounded-2xl px-4 py-1 w-28 text-center border border-ic-gray-500 mx-auto'>
          {theme}
        </div>
      </div>
      <div className={clsx(cellClassName, 'text-right px-2 !min-w-[130px]')}>
        {isLoading ? <LoadingSkeleton /> : formatPrice(price)}
      </div>
      <div
        className={clsx(cellClassName, 'text-right px-2', {
          'text-ic-green': delta !== undefined && delta > 0,
          'text-ic-red': delta !== undefined && delta < 0,
        })}
      >
        {isLoading ? <LoadingSkeleton /> : formatPercentage(delta)}
      </div>
      <div className={clsx(cellClassName, 'text-center')}>
        {isLoading ? (
          <LoadingSkeleton className='mx-auto' />
        ) : (
          formatPercentage(apy)
        )}
      </div>
      <div className={clsx(cellClassName, 'text-right px-2 pr-8')}>
        {isLoading ? <LoadingSkeleton /> : formatTvl(tvl)}
      </div>
    </Link>
  )
}
