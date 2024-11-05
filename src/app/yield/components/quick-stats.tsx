import { StatMetric } from '@/app/yield/components/stat-metric'
import { TokenDisplay } from '@/components/token-display'

import { useYieldContext } from '../provider'

export function QuickStats() {
  const { indexToken } = useYieldContext()

  return (
    <div className='border-ic-gray-200 divide-ic-gray-200 flex w-full items-center justify-between divide-x rounded-3xl border bg-[#F7F8F8] px-0 sm:px-4'>
      <div className='flex w-1/2 items-center justify-evenly py-2 sm:py-3 md:py-4'>
        <div className='flex'>
          <TokenDisplay token={indexToken} />
        </div>
        <StatMetric className='hidden sm:flex' label='TVL' value='$73.4m' />
        <StatMetric label='Token Price' value='$2,528.36' />
      </div>
      <div className='flex w-1/2 items-center justify-evenly py-2 sm:py-3 md:py-4'>
        <StatMetric className='hidden sm:flex' label='7d APY' value='4.29%' />
        <StatMetric label='30d APY' value='4.74%' />
        <StatMetric label='APY' value='4.98%' />
      </div>
    </div>
  )
}
