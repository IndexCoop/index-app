'use client'

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import { LoadingSkeleton } from '@/app/products/components/loading-skeleton'
import { ProductRowItemProps } from '@/app/products/components/product-row-item'
import { MobileRow } from '@/app/products/components/product-row-item/mobile-row'
import {
  formatPercentage,
  formatPrice,
  formatTvl,
} from '@/app/products/utils/formatters'

const rowClassName = 'text-ic-gray-600 text-sm font-medium text-right'

export function ProductRowItemMobile({
  isLoading,
  hideApyColumn,
  product: { image, symbol, name, price, delta, apy, tradeHref, tvl },
}: ProductRowItemProps) {
  return (
    <div className='flex flex-col items-center justify-between px-4 py-6 md:hidden'>
      <div className={clsx(rowClassName, 'flex w-full self-start pb-4')}>
        <div className='mr-2 min-w-[30px] overflow-hidden rounded-full'>
          <Image src={image!} alt={`${symbol} logo`} height={30} width={30} />
        </div>
        <div className='my-auto truncate'>
          <span className='text-ic-gray-950 mr-4 font-semibold'>{name}</span>
          <span className='text-ic-gray-400'>{symbol}</span>
        </div>
      </div>
      <MobileRow label='Current Price'>
        <div className={rowClassName}>
          {isLoading ? <LoadingSkeleton /> : formatPrice(price)}
        </div>
      </MobileRow>
      <MobileRow label='24h'>
        <div
          className={clsx(rowClassName, {
            'text-ic-green': delta !== undefined && delta > 0,
            'text-ic-red': delta !== undefined && delta < 0,
          })}
        >
          {isLoading ? <LoadingSkeleton /> : formatPercentage(delta)}
        </div>
      </MobileRow>
      {!hideApyColumn && (
        <MobileRow label='APY'>
          <div className={rowClassName}>
            {isLoading ? <LoadingSkeleton /> : formatPercentage(apy)}
          </div>
        </MobileRow>
      )}
      <MobileRow label='TVL'>
        <div className={rowClassName}>
          {isLoading ? <LoadingSkeleton /> : formatTvl(tvl)}
        </div>
      </MobileRow>
      <Link
        className='text-ic-blue-700 ring-ic-blue-300 mt-4 w-full rounded-md bg-white px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm ring-1 ring-inset hover:bg-gray-50'
        href={tradeHref}
      >
        {`Trade ${symbol}`}
      </Link>
    </div>
  )
}
