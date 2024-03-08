import { formatAmount } from '@/lib/utils'

import { BaseTokenStats } from './types'

export interface FormattedLeverageData {
  symbol: string
  price: string
  change24h: string
  low24h: string
  high24h: string
}

export function useFormattedLeverageData(
  stats: BaseTokenStats | null,
): FormattedLeverageData {
  if (!stats)
    return {
      symbol: '',
      price: '',
      change24h: '',
      low24h: '',
      high24h: '',
    }
  return {
    symbol: stats.symbol,
    price: `$${formatAmount(stats.price)}`,
    change24h: `${stats.change24h.toFixed(2)}%`,
    low24h: formatAmount(stats.low24h),
    high24h: formatAmount(stats.high24h),
  }
}
