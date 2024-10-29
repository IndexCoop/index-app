import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { isAddress } from 'viem'

import { ChartPeriod } from '@/components/charts/types'
import {
  fetchTokenHistoricalData,
  IndexDataInterval,
  IndexDataPeriod,
} from '@/lib/utils/api/index-data-provider'

type HistoricalData = { NetAssetValue: number; CreatedTimestamp: string }[]

const fetchSettingsByPeriod: {
  [k in ChartPeriod]: {
    interval: IndexDataInterval
    period: IndexDataPeriod
    mod: number
  }
} = {
  [ChartPeriod.Hour]: {
    // 60
    interval: 'minute',
    period: 'hour',
    mod: 1,
  },
  [ChartPeriod.Day]: {
    // 288
    interval: 'minute',
    period: 'day',
    mod: 10,
  },
  [ChartPeriod.Week]: {
    // 168
    interval: 'hour',
    period: 'week',
    mod: 1,
  },
  [ChartPeriod.Month]: {
    // 180
    interval: 'hour',
    period: 'month',
    mod: 4,
  },
  [ChartPeriod.Year]: {
    // 365
    interval: 'daily',
    period: 'year',
    mod: 1,
  },
}

export function useChartData(indexTokenAddress?: string) {
  const [selectedPeriod, setSelectedPeriod] = useState(ChartPeriod.Day)
  const [historicalData, setHistoricalData] = useState<HistoricalData>([])
  useQuery({
    enabled: isAddress(indexTokenAddress ?? ''),
    queryKey: ['token-historical-data', indexTokenAddress, selectedPeriod],
    queryFn: async () => {
      const fetchSettings = fetchSettingsByPeriod[selectedPeriod]
      const data = await fetchTokenHistoricalData({
        tokenAddress: indexTokenAddress!,
        ...fetchSettings,
      })
      const historicalData = data
        ?.map((datum) => ({
          ...datum,
          NetAssetValue: Number(datum.NetAssetValue?.toFixed(2)),
        }))
        .sort(
          (a, b) =>
            new Date(b.CreatedTimestamp).getTime() -
            new Date(a.CreatedTimestamp).getTime(),
        )
        .reverse()
        .filter((_, i) => i % fetchSettings.mod === 0)

      setHistoricalData(historicalData ?? [])
    },
  })

  return {
    historicalData,
    selectedPeriod,
    setSelectedPeriod,
  }
}
