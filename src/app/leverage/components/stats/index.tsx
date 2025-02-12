import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { LeverageSelectorContainer } from '@/app/leverage/components/stats/leverage-selector-container'
import { MarketSelector } from '@/app/leverage/components/stats/market-selector'
import { StatsMetric } from '@/app/leverage/components/stats/stats-metric'
import { formatStatsAmount } from '@/app/leverage/components/stats/use-quick-stats'
import { markets } from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { Market } from '@/app/leverage/types'
import { formatPercentage } from '@/app/products/utils/formatters'

export function QuickStats() {
  const { market } = useLeverageToken()
  const [isFetchingStats, setIsFetchingStats] = useState(true)

  const { data: marketData } = useQuery({
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: [],
    queryKey: ['market-selector'],
    queryFn: async () => {
      const marketResponses = await Promise.all(
        markets.map((item) => {
          return fetch(
            `/api/markets?symbol=${item.symbol}&currency=${item.currency}`,
          )
        }),
      )
      const marketData: Market[] = await Promise.all(
        marketResponses.map((response) => response.json()),
      )
      setIsFetchingStats(false)
      return markets.map((market, idx) => ({
        ...market,
        ...marketData[idx],
      }))
    },
  })

  const baseCurrency = useMemo(
    () => market.split(' / ')[1].toLowerCase(),
    [market],
  )

  const { price, change24h, low24h, high24h } = useMemo(() => {
    const data = marketData.find((m) => m.market === market)
    if (!data) {
      return {
        price: 0,
        change24h: 0,
        low24h: 0,
        high24h: 0,
      }
    }

    return {
      price: data.price,
      change24h: data.change24h,
      low24h: data.low24h,
      high24h: data.high24h,
    }
  }, [marketData, market])

  return (
    <div
      className='bg-ic-gray-950 flex w-full items-center justify-between rounded-lg'
      style={{ boxShadow: '2px 2px 30px 0px rgba(0, 0, 0, 0.06)' }}
    >
      <div className='flex w-full items-center justify-center px-2 py-4 sm:justify-between sm:px-4 lg:px-6'>
        <MarketSelector marketData={marketData} />
        <StatsMetric
          isLoading={isFetchingStats}
          className='hidden w-28 sm:flex'
          overrideValueClassName='text-base font-semibold h-6'
          value={formatStatsAmount(price, baseCurrency)}
        />
        <StatsMetric
          className='hidden w-20 md:flex'
          isLoading={isFetchingStats}
          label='24h Change'
          value={formatPercentage(change24h / 100)}
          overrideValueClassName={
            change24h >= 0 ? 'text-[#65D993]' : 'text-[#F36060]'
          }
        />
        <StatsMetric
          isLoading={isFetchingStats}
          className='hidden w-24 lg:flex'
          label='24h High'
          value={formatStatsAmount(high24h, baseCurrency)}
        />
        <StatsMetric
          className='hidden w-24 lg:flex'
          isLoading={isFetchingStats}
          label='24h Low'
          value={formatStatsAmount(low24h, baseCurrency)}
        />
      </div>
      <LeverageSelectorContainer />
    </div>
  )
}
