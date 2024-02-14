'use client'

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { LoadingSkeleton } from '@/app/(homepage)/components/loading-skeleton'
import { ProductRowItemProps } from '@/app/(homepage)/components/product-row-item'
import { MobileRow } from '@/app/(homepage)/components/product-row-item/mobile-row'
import {
  formatPercentage,
  formatPrice,
  formatTvl,
} from '@/app/(homepage)/utils/formatters'

const rowClassName = 'text-ic-gray-600 text-sm font-medium text-right'

export function ProductRowItemMobile({
  isLoading,
  product: { logoURI, symbol, name, price, delta, apy, tvl },
}: ProductRowItemProps) {
  return (
    <div className='items-center justify-between flex flex-col md:hidden px-4 py-6'>
      <div className={clsx(rowClassName, 'flex self-start pb-4 w-full')}>
        <div className='mr-2 overflow-hidden rounded-full min-w-[30px]'>
          <Image src={logoURI!} alt={`${symbol} logo`} height={30} width={30} />
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
      <MobileRow label='APY'>
        <div className={rowClassName}>
          {isLoading ? <LoadingSkeleton /> : formatPercentage(apy)}
        </div>
      </MobileRow>
      <MobileRow label='TVL'>
        <div className={rowClassName}>
          {isLoading ? <LoadingSkeleton /> : formatTvl(tvl)}
        </div>
      </MobileRow>
      <Link
        className='text-center w-full mt-4 text-ic-blue-700 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-inset ring-ic-blue-300 hover:bg-gray-50'
        href={`https://app.indexcoop.com/swap/eth/${symbol!.toLowerCase()}`}
      >
        {`Trade ${symbol}`}
      </Link>
    </div>
  )
}
