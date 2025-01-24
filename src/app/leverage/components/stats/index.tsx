import { LeverageSelectorContainer } from '@/app/leverage/components/stats/leverage-selector-container'
import { MarketSelector } from '@/app/leverage/components/stats/market-selector'
import { StatsMetric } from '@/app/leverage/components/stats/stats-metric'
import { useQuickStats } from '@/app/leverage/components/stats/use-quick-stats'
import { useLeverageToken } from '@/app/leverage/provider'
import { formatPercentage } from '@/app/products/utils/formatters'

export function QuickStats() {
  const { indexToken, market } = useLeverageToken()
  const { data: quickStats, isFetchingQuickStats } = useQuickStats(
    market,
    indexToken,
  )
  const { price, change24h, low24h, high24h } = quickStats.base
  return (
    <div
      className='bg-ic-gray-950 flex w-full items-center justify-between rounded-lg'
      style={{ boxShadow: '2px 2px 30px 0px rgba(0, 0, 0, 0.06)' }}
    >
      <div className='flex w-full items-center justify-center px-2 py-4 sm:justify-between sm:px-4 lg:px-6'>
        <MarketSelector />
        <StatsMetric
          isLoading={isFetchingQuickStats}
          className='hidden w-28 sm:flex'
          overrideValueClassName='text-base font-semibold h-6'
          value={price}
        />
        <StatsMetric
          className='hidden w-20 md:flex'
          isLoading={isFetchingQuickStats}
          label='24h Change'
          value={formatPercentage(change24h / 100)}
          overrideValueClassName={
            change24h >= 0 ? 'text-[#65D993]' : 'text-[#F36060]'
          }
        />
        <StatsMetric
          isLoading={isFetchingQuickStats}
          className='hidden w-24 lg:flex'
          label='24h High'
          value={high24h}
        />
        <StatsMetric
          className='hidden w-24 lg:flex'
          isLoading={isFetchingQuickStats}
          label='24h Low'
          value={low24h}
        />
      </div>
      <LeverageSelectorContainer />
    </div>
  )
}
