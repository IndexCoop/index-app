import { useMemo } from 'react'

import { useFormattedBalance } from '@/components/swap/hooks/use-swap/use-formatted-balance'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatAmount, formatWei } from '@/lib/utils'

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
  gasFeesEth: string
  gasFeesUsd: string
  inputAmount: string
  inputAmoutUsd: string
  inputBalance: bigint
  inputBalanceFormatted: string
  isFetchingQuote: boolean
  ouputAmount: string
  outputAmountUsd: string
  resetData: () => void
  shouldShowSummaryDetails: boolean
}

export function useFormattedLeverageData(
  stats: BaseTokenStats | null,
): FormattedLeverageData {
  const { address } = useWallet()
  const {
    inputToken,
    inputTokenAmount,
    inputValue,
    isFetchingQuote,
    quoteResult,
  } = useLeverageToken()

  const {
    balance,
    balanceFormatted,
    forceRefetch: forceRefetchInputBalance,
  } = useFormattedBalance(inputToken, address)

  const quote = useMemo(() => quoteResult?.quote ?? null, [quoteResult])

  const inputAmount = quote?.inputTokenAmount
    ? `${formatAmount(Number(formatWei(quote?.inputTokenAmount.toBigInt(), quote?.inputToken.decimals)))} ${quote?.inputToken.symbol}`
    : ''
  const inputAmoutUsd = quote?.inputTokenAmountUsd
    ? `$${formatAmount(quote?.inputTokenAmountUsd)}`
    : ''

  const hasInsufficientFunds = useMemo(
    () => balance < inputTokenAmount,
    [inputTokenAmount, balance],
  )

  const ouputAmount = useMemo(() => {
    if (inputValue === '') return ''
    return quote?.outputTokenAmount
      ? `${formatAmount(Number(formatWei(quote?.outputTokenAmount.toBigInt(), quote?.outputToken.decimals)))} ${quote?.outputToken.symbol}`
      : ''
  }, [inputValue, quote])
  const outputAmountUsd = quote?.outputTokenAmountUsd
    ? `$${formatAmount(quote?.outputTokenAmountUsd)}`
    : ''

  const resetData = () => {
    forceRefetchInputBalance()
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
    gasFeesEth: quote?.gasCosts
      ? `(${formatWei(quote.gasCosts.toBigInt(), 18)} ETH)`
      : '',
    gasFeesUsd: quote?.gasCostsInUsd
      ? `$${formatAmount(quote.gasCostsInUsd)}`
      : '',
    inputAmount,
    inputAmoutUsd,
    inputBalance: balance,
    inputBalanceFormatted: balanceFormatted,
    isFetchingQuote,
    ouputAmount,
    outputAmountUsd,
    resetData,
    shouldShowSummaryDetails,
  }
}
