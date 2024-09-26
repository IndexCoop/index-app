import { useMemo } from 'react'

import { useFormattedBalance } from '@/components/swap/hooks/use-swap/use-formatted-balance'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatAmount, formatWei } from '@/lib/utils'

import { useRedeem } from '../../providers/redeem-provider'

export function useFormattedData() {
  const { address } = useWallet()
  const {
    inputToken,
    inputTokenAmount,
    inputValue,
    isFetchingQuote,
    quoteResult,
  } = useRedeem()
  const {
    balance,
    balanceFormatted,
    forceRefetch: forceRefetchPreSaleTokenBalance,
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

  const outputAmount = quote?.outputTokenAmount
    ? `${formatAmount(Number(formatWei(quote?.outputTokenAmount.toBigInt(), quote?.outputToken.decimals)))} ${quote?.outputToken.symbol}`
    : ''
  const outputAmountUsd = quote?.outputTokenAmountUsd
    ? `$${formatAmount(quote?.outputTokenAmountUsd)}`
    : ''

  const shouldShowSummaryDetails = useMemo(
    () => quote !== null && inputValue !== '',
    [inputValue, quote],
  )

  const forceRefetch = () => {
    forceRefetchPreSaleTokenBalance()
  }

  return {
    hasInsufficientFunds,
    gasFeesEth: quote?.gasCosts
      ? `(${formatWei(quote.gasCosts.toBigInt(), 18)} ETH)`
      : '',
    gasFeesUsd: quote?.gasCostsInUsd
      ? `$${formatAmount(quote.gasCostsInUsd)}`
      : '',
    inputAmount,
    inputAmoutUsd,
    inputTokenBalance: balance,
    inputTokenBalanceFormatted: balanceFormatted,
    isFetchingQuote,
    outputAmount,
    outputAmountUsd,
    shouldShowSummaryDetails,
    forceRefetch,
  }
}
