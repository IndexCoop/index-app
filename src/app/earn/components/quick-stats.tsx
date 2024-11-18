import { StatMetric } from '@/app/earn/components/stat-metric'
import { formatPercentage, formatTvl } from '@/app/products/utils/formatters'
import { TokenDisplay } from '@/components/token-display'
import { formatDollarAmount } from '@/lib/utils'

import { useEarnContext } from '../provider'

export function QuickStats() {
  const { indexToken, isFetchingStats, nav, apy, apy30d, apy7d, tvl } =
    useEarnContext()

  return (
    <div className='border-ic-gray-200 divide-ic-gray-200 flex w-full items-center justify-between divide-x rounded-3xl border bg-[#F7F8F8] px-0 sm:px-4'>
      <div className='flex w-1/2 items-center justify-evenly py-2 sm:py-3 md:py-4'>
        <div className='flex'>
          <TokenDisplay token={indexToken} />
        </div>
        <StatMetric
          className='hidden w-20 sm:flex'
          isLoading={isFetchingStats}
          label='TVL'
          value={formatTvl(tvl)}
        />
        <StatMetric
          className='w-24'
          isLoading={isFetchingStats}
          label='Token Price'
          value={formatDollarAmount(nav, true)}
        />
      </div>
      <div className='flex w-1/2 items-center justify-evenly py-2 sm:py-3 md:py-4'>
        <StatMetric
          isLoading={isFetchingStats}
          className='hidden w-16 sm:flex'
          label='7d APY'
          value={formatPercentage(apy7d, true)}
        />
        <StatMetric
          className='w-16'
          isLoading={isFetchingStats}
          label='30d APY'
          value={formatPercentage(apy30d, true)}
        />
        <StatMetric
          className='w-16'
          isLoading={isFetchingStats}
          label='APY'
          value={formatPercentage(apy, true)}
        />
      </div>
    </div>
  )
}
