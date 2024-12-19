import { useQuery } from '@tanstack/react-query'

import { formatAmount, formatDollarAmount } from '@/lib/utils'

interface QuickStats {
  symbol: string
  price: string
  change24h: number
  low24h: string
  high24h: string
}

interface QuickStatsApiResponse {
  symbol: string
  price: number
  change24h: number
  low24h: number
  high24h: number
}

function formatStatsAmount(amount: number, baseCurrency: string): string {
  if (baseCurrency === 'btc') return `${formatAmount(amount)} BTC`
  if (baseCurrency === 'eth') return `${formatAmount(amount)} ETH`
  return formatDollarAmount(amount, true, 2)
}

export function useQuickStats(market: string) {
  async function fetchStats(): Promise<QuickStats> {
    const m = market.split(' / ')
    const symbol = m[0]
    const baseCurrency = m[1].toLowerCase()
    try {
      const response = await fetch(
        `/api/stats?symbol=${symbol}&baseCurrency=${baseCurrency}`,
        {
          method: 'GET',
        },
      )
      const json: QuickStatsApiResponse = await response.json()
      return {
        symbol: json.symbol,
        price: formatStatsAmount(json.price, baseCurrency),
        change24h: json.change24h,
        low24h: formatStatsAmount(json.low24h, baseCurrency),
        high24h: formatStatsAmount(json.high24h, baseCurrency),
      }
    } catch (error) {
      console.warn('Error fetching quick stats:', error)
      return {
        symbol,
        price: '',
        change24h: 0,
        low24h: '',
        high24h: '',
      }
    }
  }

  const { data, isFetching } = useQuery({
    queryKey: [
      'fetch-quick-stats',
      {
        market,
      },
    ],
    queryFn: fetchStats,
  })

  return {
    data: data ?? {
      symbol: '',
      price: '',
      change24h: 0,
      low24h: '',
      high24h: '',
    },
    isFetchingQuickStats: isFetching,
  }
}
