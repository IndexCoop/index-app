import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { isAddress } from 'viem'

import { ChartPeriod } from '@/components/charts/types'
import {
  fetchTokenHistoricalData,
  fetchTokenMetrics,
  IndexDataInterval,
  IndexDataPeriod,
} from '@/lib/utils/api/index-data-provider'

const fetchSettingsByPeriod: {
  [k in ChartPeriod]: { interval: IndexDataInterval; period: IndexDataPeriod }
} = {
  [ChartPeriod.Hour]: {
    interval: 'minute',
    period: 'hour',
  },
  [ChartPeriod.Day]: {
    interval: 'hour',
    period: 'day',
  },
  [ChartPeriod.Week]: {
    interval: 'hour',
    period: 'week',
  },
  [ChartPeriod.Month]: {
    interval: 'daily',
    period: 'month',
  },
  [ChartPeriod.Year]: {
    interval: 'daily',
    period: 'year',
  },
}

export function useChartData(indexTokenAddress?: string) {
  const [selectedPeriod, setSelectedPeriod] = useState(ChartPeriod.Day)
  const { data: historicalData } = useQuery({
    enabled: isAddress(indexTokenAddress ?? ''),
    initialData: [],
    queryKey: ['token-historical-data', indexTokenAddress, selectedPeriod],
    queryFn: async () => {
      const historicalData = await fetchTokenHistoricalData({
        tokenAddress: indexTokenAddress!,
        ...fetchSettingsByPeriod[selectedPeriod],
      })
      return historicalData?.map((datum) => ({
        ...datum,
        NetAssetValue: Number(datum.NetAssetValue?.toFixed(2)),
      }))
    },
    select: (data) =>
      (data ?? [])
        .sort(
          (a, b) =>
            new Date(b.CreatedTimestamp).getTime() -
            new Date(a.CreatedTimestamp).getTime(),
        )
        .reverse(),
  })

  const { data: nav } = useQuery({
    enabled: isAddress(indexTokenAddress ?? ''),
    initialData: 0,
    queryKey: ['token-nav', indexTokenAddress],
    queryFn: async () => {
      const data = await fetchTokenMetrics({
        tokenAddress: indexTokenAddress!,
        metrics: ['nav'],
      })

      return data?.NetAssetValue ?? 0
    },
  })

  return {
    historicalData,
    nav,
    selectedPeriod,
    setSelectedPeriod,
  }
}
