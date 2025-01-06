import { QueryFunctionContext, useQuery } from '@tanstack/react-query'

import { formatAmount, formatDollarAmount } from '@/lib/utils'

interface QuickStats {
  base: {
    symbol: string
    price: string
    change24h: number
    low24h: string
    high24h: string
  }
  token: {
    symbol: string
    costOfCarry: number
    nav: number
    navchange: number
  }
}

interface QuickStatsApiResponse {
  base: {
    symbol: string
    price: number
    change24h: number
    low24h: number
    high24h: number
  }
  token: {
    symbol: string
    costOfCarry: number
    nav: number
    navchange: number
  }
}

type QuickStatsQueryKey = [
  string,
  { address: string | undefined; symbol: string; market: string },
]

function formatStatsAmount(amount: number, baseCurrency: string): string {
  if (baseCurrency === 'btc') return `${formatAmount(amount, 4)} BTC`
  if (baseCurrency === 'eth') return `${formatAmount(amount, 4)} ETH`
  return formatDollarAmount(amount, true, 2)
}

export function useQuickStats(
  market: string,
  indexToken: { address: string | undefined; symbol: string },
) {
  async function fetchStats(
    context: QueryFunctionContext<QuickStatsQueryKey>,
  ): Promise<QuickStats> {
    const [, { address, symbol, market }] = context.queryKey
    const m = market.split(' / ')
    const baseToken = m[0]
    const baseCurrency = m[1].toLowerCase()
    try {
      const response = await fetch(
        `/api/stats?address=${address}&symbol=${symbol}&base=${baseToken}&baseCurrency=${baseCurrency}`,
        {
          method: 'GET',
        },
      )
      const { base, token }: QuickStatsApiResponse = await response.json()
      return {
        base: {
          symbol: base.symbol,
          price: formatStatsAmount(base.price, baseCurrency),
          change24h: base.change24h,
          low24h: formatStatsAmount(base.low24h, baseCurrency),
          high24h: formatStatsAmount(base.high24h, baseCurrency),
        },
        token,
      }
    } catch (error) {
      console.warn('Error fetching quick stats:', error)
      return {
        base: {
          symbol: baseToken,
          price: '',
          change24h: 0,
          low24h: '',
          high24h: '',
        },
        token: {
          symbol: '',
          costOfCarry: 0,
          nav: 0,
          navchange: 0,
        },
      }
    }
  }

  const { data, isFetching } = useQuery({
    queryKey: [
      'fetch-quick-stats',
      {
        symbol: indexToken.symbol,
        address: indexToken.address,
        market,
      },
    ],
    queryFn: fetchStats,
    enabled: !!indexToken.address,
  })

  return {
    data: data ?? {
      base: {
        symbol: '',
        price: '',
        change24h: 0,
        low24h: '',
        high24h: '',
      },
      token: {
        symbol: '',
        costOfCarry: 0,
        nav: 0,
        navchange: 0,
      },
    },
    isFetchingQuickStats: isFetching,
  }
}
