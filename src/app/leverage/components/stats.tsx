import clsx from 'clsx'
import Image from 'next/image'

import { useLeverageToken } from '../provider'
import { useFormattedLeverageData } from '../use-formatted-data'

export function Stats() {
  const { stats } = useLeverageToken()
  const { symbol, price, change24h, change24hIsPositive, low24h, high24h } =
    useFormattedLeverageData(stats)
  const iconColor = change24hIsPositive ? 'text-ic-green' : 'text-ic-red'
  return (
    <div className='border-ic-gray-600 flex flex-row items-center gap-10 rounded-3xl border bg-[#1C2C2E] px-8 py-6'>
      <div className='flex'>
        <div className='text-ic-gray-50 text-xl font-bold'>{symbol} / USD</div>
      </div>
      <div className='text-ic-white text-xl font-semibold'>{price}</div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h Change</div>
        {change24h.length > 0 && (
          <div className='flex flex-row items-center gap-1'>
            <div className={clsx(iconColor)}>
              <Image
                alt='indicator icon'
                src='/assets/chevron-stats-icon.svg'
                width={8}
                height={5}
              />
            </div>
            <div className='text-ic-green text-base font-semibold'>
              {change24h}
            </div>
          </div>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h High</div>
        <div className='text-ic-white text-base font-semibold'>{high24h}</div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h Low</div>
        <div className='text-ic-white text-base font-semibold'>{low24h}</div>
      </div>
    </div>
  )
}
