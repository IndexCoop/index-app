import { useMemo } from 'react'

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
  hasInsufficientFunds: boolean
  inputBalance: bigint
  inputBalanceFormatted: string
  isFetchingQuote: boolean
  resetData: () => void
  // TBD
  gasFeesEth: string
  gasFeesUsd: string
  inputAmount: string
  inputAmoutUsd: string
  ouputAmount: string
  outputAmountUsd: string
  shouldShowSummaryDetails: boolean
}

export function useFormattedLeverageData(
  stats: BaseTokenStats | null,
): FormattedLeverageData {
  const { address } = useWallet()
  const { inputToken, inputTokenAmount, inputValue, isFetchingQuote } =
    useLeverageToken()
  const quote = null

  const { balance, balanceFormatted, forceRefetch } = useFormattedBalance(
    inputToken,
    address,
  )

  const hasInsufficientFunds = useMemo(
    () => balance < inputTokenAmount,
    [inputTokenAmount, balance],
  )

  const resetData = () => {
    forceRefetch()
  }

  const shouldShowSummaryDetails = useMemo(
    () => quote !== null && inputValue !== '',
    [inputValue, quote],
  )

  return {
    symbol: stats?.symbol ?? '',
    price: stats ? `$${formatAmount(stats.price)}` : '',
    change24h: stats ? `${stats.change24h.toFixed(2)}%` : '',
    change24hIsPositive: stats ? stats.change24h >= 0 : true,
    low24h: stats ? formatAmount(stats.low24h) : '',
    high24h: stats ? formatAmount(stats.high24h) : '',
    hasInsufficientFunds,
    inputBalance: balance,
    inputBalanceFormatted: balanceFormatted,
    resetData,
    // TBD
    gasFeesEth: '',
    gasFeesUsd: '',
    inputAmount: '',
    inputAmoutUsd: '',
    isFetchingQuote,
    ouputAmount: '',
    outputAmountUsd: '',
    shouldShowSummaryDetails,
  }
}
