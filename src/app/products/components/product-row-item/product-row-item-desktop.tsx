'use client'

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import { LoadingSkeleton } from '@/app/products/components/loading-skeleton'
import { ProductRowItemProps } from '@/app/products/components/product-row-item'
import {
  formatPercentage,
  formatPrice,
  formatTvl,
} from '@/app/products/utils/formatters'

const cellClassName = 'text-ic-gray-600 text-sm font-medium min-w-[120px]'

export function ProductRowItemDesktop({
  isLoading,
  hideApyColumn,
  product: { image, symbol, name, tradeHref, price, delta, apy, tvl },
}: ProductRowItemProps) {
  return (
    <Link
      className='hover:bg-ic-gray-100 hidden h-[60px] min-w-fit items-center justify-between odd:border-[#FBFCFC] odd:bg-[#FBFCFC] even:border-transparent hover:cursor-pointer md:flex'
      href={tradeHref}
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
      {!hideApyColumn && (
        <div className={clsx(cellClassName, 'text-center')}>
          {isLoading ? (
            <LoadingSkeleton className='mx-auto' />
          ) : (
            formatPercentage(apy)
          )}
        </div>
      )}
      <div className={clsx(cellClassName, 'px-2 pr-8 text-right')}>
        {isLoading ? <LoadingSkeleton /> : formatTvl(tvl)}
      </div>
    </Link>
  )
}
