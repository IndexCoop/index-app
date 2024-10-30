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
  }
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

export function usePriceChartData(indexTokenAddress?: string) {
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
            new Date(a.CreatedTimestamp).getTime() -
            new Date(b.CreatedTimestamp).getTime(),
        )

      // Explicitly using setState to avoid data being set to []
      // when the loading starts - too much jank.
      setHistoricalData(historicalData ?? [])
    },
  })

  return {
    historicalData,
    selectedPeriod,
    setSelectedPeriod,
  }
}
