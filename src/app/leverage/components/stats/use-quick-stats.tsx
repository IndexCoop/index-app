import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { type QueryFunctionContext, useQuery } from '@tanstack/react-query'

import { formatAmount, formatDollarAmount } from '@/lib/utils'

export interface QuickStats {
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
    streamingFee: number
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
    streamingFee: number
  }
}

type QuickStatsQueryKey = [
  string,
  {
    chainId: number
    address: string | undefined
    symbol: string
    market: string
  },
]

export function formatStatsAmount(
  amount: number,
  baseCurrency: string,
): string {
  if (baseCurrency.toLowerCase() === 'btc')
    return `₿ ${formatAmount(amount, 4)}`
  if (baseCurrency.toLowerCase() === 'eth')
    return `Ξ ${formatAmount(amount, 4)}`
  return formatDollarAmount(amount, true, 2)
}

export function useQuickStats(
  market: string,
  indexToken: { address: string | undefined; chainId: number; symbol: string },
) {
  async function fetchStats(
    context: QueryFunctionContext<QuickStatsQueryKey>,
  ): Promise<QuickStats> {
    const [, { address, chainId, symbol, market }] = context.queryKey
    const m = market.split(' / ')
    const baseToken = m[0]
    const baseCurrency = m[1].toLowerCase()
    try {
      const response = await fetch(
        `/api/stats?address=${address}&chainId=${chainId}&symbol=${symbol}&base=${baseToken}&baseCurrency=${baseCurrency}`,
        { method: 'GET' },
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
          streamingFee: 0,
        },
      }
    }
  }

  const address =
    getTokenByChainAndSymbol(indexToken.chainId, indexToken.symbol)?.address ??
    ''
  const { data, isFetching } = useQuery({
    queryKey: [
      'fetch-quick-stats',
      {
        chainId: indexToken.chainId,
        symbol: indexToken.symbol,
        address,
        market,
      },
    ],
    queryFn: fetchStats,
    enabled: !!address,
    refetchOnWindowFocus: false,
  })

  return {
    data: data ?? {
      base: { symbol: '', price: '', change24h: 0, low24h: '', high24h: '' },
      token: {
        symbol: '',
        costOfCarry: 0,
        nav: 0,
        navchange: 0,
        streamingFee: 0,
      },
    },
    isFetchingQuickStats: isFetching,
  }
}
