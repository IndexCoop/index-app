'use client'

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import { LoadingSkeleton } from '@/app/(light)/products/components/loading-skeleton'
import { ProductRowItemProps } from '@/app/(light)/products/components/product-row-item'
import { ProductType } from '@/app/(light)/products/types/product'
import {
  formatPercentage,
  formatPrice,
  formatTvl,
} from '@/app/(light)/products/utils/formatters'

const cellClassName = 'text-ic-gray-600 text-sm font-medium min-w-[120px]'

export function ProductRowItemDesktop({
  isLoading,
  product: { image, symbol, name, theme, type, price, delta, apy, tvl },
}: ProductRowItemProps) {
  return (
    <Link
      className='hover:bg-ic-gray-100 hidden h-[60px] min-w-fit items-center justify-between odd:border-[#FBFCFC] odd:bg-[#FBFCFC] even:border-transparent hover:cursor-pointer md:flex'
      href={`/swap/eth/${symbol!.toLowerCase()}`}
    >
      <div
        className={clsx(
          cellClassName,
          'flex !min-w-[410px] max-w-[460px] pl-6',
        )}
      >
        {isLoading ? (
          <LoadingSkeleton className='w-full' />
        ) : (
          <>
            <div className='mr-2 overflow-hidden rounded-full'>
              <Image
                src={image!}
                alt={`${symbol} logo`}
                height={30}
                width={30}
              />
            </div>
            <div className='my-auto'>
              <span className='text-ic-gray-950 mr-4 font-semibold'>
                {name}
              </span>
              <span className='text-ic-gray-400'>{symbol}</span>
            </div>
          </>
        )}
      </div>
      <div className={cellClassName}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div
            className={clsx(
              'border-ic-gray-500 mx-auto w-28 rounded-2xl border px-4 py-1 text-center',
              {
                'bg-[#E7F2FF]': type === ProductType.LEVERAGE,
                'bg-[#F4ECFF]': type === ProductType.INDEX,
                'bg-[#FEEFF7]': type === ProductType.YIELD,
              },
            )}
          >
            {type}
          </div>
        )}
      </div>

      <div className={cellClassName}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className='bg-ic-gray-300 border-ic-gray-500 mx-auto w-28 rounded-2xl border px-4 py-1 text-center'>
            {theme}
          </div>
        )}
      </div>
      <div className={clsx(cellClassName, '!min-w-[130px] px-2 text-right')}>
        {isLoading ? <LoadingSkeleton /> : formatPrice(price)}
      </div>
      <div
        className={clsx(cellClassName, 'px-2 text-right', {
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
      <div className={clsx(cellClassName, 'px-2 pr-8 text-right')}>
        {isLoading ? <LoadingSkeleton /> : formatTvl(tvl)}
      </div>
    </Link>
  )
}
