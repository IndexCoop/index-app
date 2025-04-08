import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { LeverageSelectorContainer } from '@/app/leverage/components/stats/leverage-selector-container'
import { MarketSelector } from '@/app/leverage/components/stats/market-selector'
import { NetRateTooltip } from '@/app/leverage/components/stats/net-rate-tooltip'
import { StatsMetric } from '@/app/leverage/components/stats/stats-metric'
import {
  formatStatsAmount,
  useQuickStats,
} from '@/app/leverage/components/stats/use-quick-stats'
import { markets } from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { Market } from '@/app/leverage/types'
import { formatPercentage } from '@/app/products/utils/formatters'
import { useNetwork } from '@/lib/hooks/use-network'

export function QuickStats() {
  const { chainId } = useNetwork()
  const { indexToken, market } = useLeverageToken()
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

  const {
    data: { token },
    isFetchingQuickStats,
  } = useQuickStats(market, { ...indexToken, chainId: chainId ?? 1 })

  const baseCurrency = useMemo(
    () => market.split(' / ')[1].toLowerCase(),
    [market],
  )

  const { marketPrice, marketChange24h } = useMemo(() => {
    const data = marketData.find((m) => m.market === market)
    if (!data) {
      return {
        marketPrice: 0,
        marketChange24h: 0,
      }
    }

    return {
      marketPrice: data.price,
      marketChange24h: data.change24h,
    }
  }, [marketData, market])

  const isFetching = isFetchingQuickStats || isFetchingStats

  return (
    <div
      className='flex w-full items-center justify-between rounded-lg bg-zinc-900'
      style={{ boxShadow: '2px 2px 30px 0px rgba(0, 0, 0, 0.06)' }}
    >
      <div className='flex w-full items-center justify-center px-2 py-4 sm:justify-start sm:gap-x-10 sm:px-4 lg:px-6'>
        <MarketSelector marketData={marketData} />
        <StatsMetric
          isLoading={isFetching}
          label='Current Price'
          className='hidden w-28 sm:flex'
          overrideValueClassName='text-base font-semibold h-6'
          value={formatStatsAmount(marketPrice, baseCurrency)}
        />
        <StatsMetric
          className='hidden w-20 xl:flex'
          isLoading={isFetching}
          label='24h Change'
          value={formatPercentage(marketChange24h / 100)}
          overrideValueClassName={
            marketChange24h >= 0 ? 'text-[#6CF29A]' : 'text-[#F36060]'
          }
        />
      </div>
      <div className='flex h-full w-full items-center justify-center pr-2 sm:justify-start sm:gap-x-10 sm:pr-4 lg:pr-6 xl:gap-x-6 2xl:gap-x-12'>
        <LeverageSelectorContainer />
        <StatsMetric
          className='hidden w-20 xl:flex'
          isLoading={isFetching}
          label='24h Change'
          value={formatPercentage(token.navchange)}
          overrideValueClassName={
            token.navchange >= 0 ? 'text-[#6CF29A]' : 'text-[#F36060]'
          }
        />
        <NetRateTooltip token={token} isFetching={isFetching} />
      </div>
    </div>
  )
}
