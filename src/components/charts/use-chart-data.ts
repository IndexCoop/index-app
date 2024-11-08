import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { isAddress } from 'viem'

import { ChartPeriod } from '@/components/charts/types'
import {
  fetchTokenHistoricalData,
  IndexData,
  IndexDataInterval,
  IndexDataMetric,
  IndexDataPeriod,
} from '@/lib/utils/api/index-data-provider'

type HistoricalData = {
  NetAssetValue?: number
  ProductAssetValue?: number
  CreatedTimestamp: string
}[]

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

type PartialIndexData = Partial<IndexData> & {
  CreatedTimestamp: string
}

function formatData(data: PartialIndexData[], metric: IndexDataMetric) {
  if (metric === 'nav') {
    return data.map((datum) => ({
      ...datum,
      NetAssetValue: Number(datum.NetAssetValue?.toFixed(2)),
    }))
  }

  if (metric === 'pav') {
    return data.map((datum) => ({
      ...datum,
      ProductAssetValue: Number(datum.ProductAssetValue?.toFixed(0)),
    }))
  }

  return []
}

export function useChartData(
  indexTokenAddress?: string,
  metric: IndexDataMetric = 'nav',
) {
  const [selectedPeriod, setSelectedPeriod] = useState(ChartPeriod.Day)
  const [historicalData, setHistoricalData] = useState<HistoricalData>([])
  useQuery({
    enabled: isAddress(indexTokenAddress ?? ''),
    queryKey: [
      'token-historical-data',
      indexTokenAddress,
      metric,
      selectedPeriod,
    ],
    queryFn: async () => {
      const fetchSettings = fetchSettingsByPeriod[selectedPeriod]
      const data = await fetchTokenHistoricalData({
        metrics: [metric],
        tokenAddress: indexTokenAddress!,
        ...fetchSettings,
      })

      const formattedData = formatData(data ?? [], metric)
      const historicalData = formattedData.sort(
        (a, b) =>
          new Date(a.CreatedTimestamp).getTime() -
          new Date(b.CreatedTimestamp).getTime(),
      )

      // Explicitly using setState to avoid data being set to []
      // when the loading starts - too much jank.
      setHistoricalData(historicalData ?? [])
      return null
    },
  })

  return {
    historicalData,
    selectedPeriod,
    setSelectedPeriod,
  }
}
