import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
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
import { digitsByAddress } from '@/lib/utils/tokens'

type HistoricalData = {
  NetAssetValue?: number
  ProductAssetValue?: number
  CreatedTimestamp: string
}[]

const fetchSettingsByPeriod: {
  [k in ChartPeriod]: {
    interval: IndexDataInterval
    period: IndexDataPeriod
    sample: number
  }
} = {
  [ChartPeriod.Hour]: {
    interval: 'minute',
    period: 'hour',
    sample: 1,
  },
  [ChartPeriod.Day]: {
    interval: 'minute',
    period: 'day',
    sample: 10,
  },
  [ChartPeriod.Week]: {
    interval: 'hour',
    period: 'week',
    sample: 1,
  },
  [ChartPeriod.Month]: {
    interval: 'hour',
    period: 'month',
    sample: 4,
  },
  [ChartPeriod.Year]: {
    interval: 'daily',
    period: 'year',
    sample: 1,
  },
}

type PartialIndexData = Partial<IndexData> & {
  CreatedTimestamp: string
}

function formatData(data: PartialIndexData[], metric: IndexDataMetric, digits: number = 2) {
  if (metric === 'nav') {
    return data.map((datum) => ({
      ...datum,
      NetAssetValue: Number(datum.NetAssetValue?.toFixed(digits)),
    }))
  }

  if (metric === 'pav') {
    return data.map((datum) => ({
      ...datum,
      ProductAssetValue: Number(datum.ProductAssetValue?.toFixed(2)),
    }))
  }

  return []
}

export function useChartData(
  indexTokenAddress?: string,
  metric: IndexDataMetric = 'nav',
) {
  const [selectedPeriod, setSelectedPeriod] = useState(ChartPeriod.Week)
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
      const { sample, ...fetchSettings } = fetchSettingsByPeriod[selectedPeriod]
      const data = await fetchTokenHistoricalData({
        metrics: [metric],
        tokenAddress: indexTokenAddress!,
        ...fetchSettings,
      })

      const digits = digitsByAddress(indexTokenAddress ?? '')
      const formattedData = formatData(data ?? [], metric, digits)
      const historicalData = formattedData
        .sort(
          (a, b) =>
            new Date(a.CreatedTimestamp).getTime() -
            new Date(b.CreatedTimestamp).getTime(),
        )
        .filter((item) => {
          if (sample === 1) return true
          if (fetchSettings.interval === 'minute') {
            const minute = dayjs(item.CreatedTimestamp).minute()
            return minute % sample === 0
          }
          if (fetchSettings.interval === 'hour') {
            const hour = dayjs(item.CreatedTimestamp).hour()
            return hour % sample === 0
          }
          return false
        })

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
