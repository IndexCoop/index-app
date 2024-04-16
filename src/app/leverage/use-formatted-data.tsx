import { useFormattedBalance } from '@/components/swap/hooks/use-swap/use-formatted-balance'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatAmount } from '@/lib/utils'

import { useLeverageToken } from './provider'
import { BaseTokenStats } from './types'

export interface FormattedLeverageData {
  symbol: string
  price: string
  change24h: string
  change24hIsPositive: boolean
  low24h: string
  high24h: string
  inputBalance: string
  resetData: () => void
  // TBD
  gasFeesEth: string
  gasFeesUsd: string
  inputAmount: string
  inputAmoutUsd: string
  isFetchingQuote: boolean
  ouputAmount: string
  outputAmountUsd: string
  shouldShowSummaryDetails: boolean
}

export function useFormattedLeverageData(
  stats: BaseTokenStats | null,
): FormattedLeverageData {
  const { address } = useWallet()
  const { inputToken } = useLeverageToken()
  const { balanceFormatted, forceRefetch } = useFormattedBalance(
    inputToken,
    address,
  )
  const resetData = () => {
    forceRefetch()
  }
  return {
    symbol: stats?.symbol ?? '',
    price: stats ? `$${formatAmount(stats.price)}` : '',
    change24h: stats ? `${stats.change24h.toFixed(2)}%` : '',
    change24hIsPositive: stats ? stats.change24h >= 0 : true,
    low24h: stats ? formatAmount(stats.low24h) : '',
    high24h: stats ? formatAmount(stats.high24h) : '',
    inputBalance: balanceFormatted,
    resetData,
    // TBD
    gasFeesEth: '',
    gasFeesUsd: '',
    inputAmount: '',
    inputAmoutUsd: '',
    isFetchingQuote: false,
    ouputAmount: '',
    outputAmountUsd: '',
    shouldShowSummaryDetails: true,
  }
}
