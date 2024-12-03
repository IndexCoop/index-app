import { StatMetric } from '@/app/earn/components/stat-metric'
import { formatPercentage, formatTvl } from '@/app/products/utils/formatters'
import { TokenDisplay } from '@/components/token-display'
import { formatDollarAmount } from '@/lib/utils'

import { useEarnContext } from '../provider'

export function QuickStats() {
  const { indexToken, isFetchingStats, nav, apy, apy30d, apy7d, tvl } =
    useEarnContext()

  return (
    <div className='border-ic-gray-200 divide-ic-gray-200 flex w-full items-center justify-between rounded-lg border bg-[#F7F8F8]'>
      <div className='flex items-center justify-between px-4 py-2 sm:py-3 md:px-8 md:py-4'>
        <div className='flex'>
          <TokenDisplay smHideLabel token={indexToken} />
        </div>
        <div className='hidden lg:flex'>
          The largest USDC lending opportunities on Base.
        </div>
      </div>
      <div className='flex items-center justify-between px-4 py-2 sm:py-3 md:px-8 md:py-4'>
        <StatMetric
          className='w-16'
          isLoading={isFetchingStats}
          label='APY'
          value={formatPercentage(apy, true)}
        />
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
      </div>
    </div>
  )
}
