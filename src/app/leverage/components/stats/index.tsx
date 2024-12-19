import { LeverageSelectorContainer } from '@/app/leverage/components/stats/leverage-selector-container'
import { MarketSelector } from '@/app/leverage/components/stats/market-selector'
import { StatsMetric } from '@/app/leverage/components/stats/stats-metric'
import { useLeverageToken } from '@/app/leverage/provider'
import { useFormattedLeverageData } from '@/app/leverage/use-formatted-data'

export function QuickStats() {
  const { isFetchingStats, stats } = useLeverageToken()
  const { price, change24h, change24hIsPositive, low24h, high24h } =
    useFormattedLeverageData(stats)
  return (
    <div
      className='bg-ic-gray-950 flex w-full items-center justify-between rounded-lg'
      style={{ boxShadow: '2px 2px 30px 0px rgba(0, 0, 0, 0.06)' }}
    >
      <div className='flex w-full items-center justify-between py-4 pl-6 pr-16'>
        <MarketSelector />
        <div className='text-ic-white hidden w-20 text-base font-semibold md:flex'>
          {price}
        </div>
        <StatsMetric
          className='hidden w-20 sm:flex'
          isLoading={isFetchingStats}
          label='24h Change'
          value={change24h}
          overrideLabelColor={
            change24hIsPositive ? 'text-ic-green' : 'text-ic-red'
          }
        />
        <StatsMetric
          isLoading={isFetchingStats}
          className='hidden w-16 lg:flex'
          label='24h High'
          value={high24h}
        />
        <StatsMetric
          className='hidden w-16 lg:flex'
          isLoading={isFetchingStats}
          label='24h Low'
          value={low24h}
        />
      </div>
      <LeverageSelectorContainer />
    </div>
  )
}
