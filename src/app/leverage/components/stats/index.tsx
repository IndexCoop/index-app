import { LeverageSelectorContainer } from '@/app/leverage/components/stats/leverage-selector-container'
import { MarketSelector } from '@/app/leverage/components/stats/market-selector'
import { StatsMetric } from '@/app/leverage/components/stats/stats-metric'
import { useQuickStats } from '@/app/leverage/components/stats/use-quick-stats'
import { useLeverageToken } from '@/app/leverage/provider'
import { formatAmount } from '@/lib/utils'

export function QuickStats() {
  const { market } = useLeverageToken()
  const { data: quickStats, isFetchingQuickStats } = useQuickStats(market)
  const { price, change24h, low24h, high24h } = quickStats
  return (
    <div
      className='bg-ic-gray-950 flex w-full items-center justify-between rounded-lg'
      style={{ boxShadow: '2px 2px 30px 0px rgba(0, 0, 0, 0.06)' }}
    >
      <div className='flex w-full items-center justify-center px-2 py-4 sm:px-4 md:justify-between md:px-6'>
        <MarketSelector />
        <div className='text-ic-white hidden w-28 text-base font-semibold md:flex'>
          {price}
        </div>
        <StatsMetric
          className='hidden w-20 sm:flex'
          isLoading={isFetchingQuickStats}
          label='24h Change'
          value={`${formatAmount(change24h, 2)} %`}
          overrideLabelColor={change24h >= 0 ? 'text-ic-green' : 'text-ic-red'}
        />
        <StatsMetric
          isLoading={isFetchingQuickStats}
          className='hidden lg:flex'
          label='24h High'
          value={high24h}
        />
        <StatsMetric
          className='hidden lg:flex'
          isLoading={isFetchingQuickStats}
          label='24h Low'
          value={low24h}
        />
      </div>
      <LeverageSelectorContainer />
    </div>
  )
}
