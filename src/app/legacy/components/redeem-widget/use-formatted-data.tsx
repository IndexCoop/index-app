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
  const legacyQuote = useMemo(() => quoteResult?.legacy ?? null, [quoteResult])

  const inputAmount = quote?.inputTokenAmount
    ? `${formatAmount(Number(formatWei(quote?.inputTokenAmount, quote?.inputToken.decimals)))} ${quote?.inputToken.symbol}`
    : ''
  const inputAmoutUsd = quote?.inputTokenAmountUsd
    ? `$${formatAmount(quote?.inputTokenAmountUsd)}`
    : ''

  const hasInsufficientFunds = useMemo(
    () => balance < inputTokenAmount,
    [inputTokenAmount, balance],
  )

  let outputAmounts: string[] = []
  let outputAmountsUsd: string[] = []
  let outputAmountUsd = ''
  if (legacyQuote) {
    const { outputTokens, outputTokenPricesUsd, units } = legacyQuote
    outputAmounts = outputTokens.map((outputToken, index) =>
      formatAmount(Number(formatWei(units[index], outputToken.decimals)), 4),
    )
    outputAmountsUsd = outputTokenPricesUsd.map(
      (price) => `$${formatAmount(price)}`,
    )
    const outputAmountUsdRaw = outputTokenPricesUsd.reduce(
      (total, curr) => total + curr,
      0,
    )
    outputAmountUsd = `$${formatAmount(outputAmountUsdRaw)}`
  }

  const outputAmount = outputAmounts[0] ?? ''

  const shouldShowSummaryDetails = useMemo(
    () => quote !== null && inputValue !== '',
    [inputValue, quote],
  )

  const forceRefetch = () => {
    forceRefetchPreSaleTokenBalance()
  }

  return {
    hasInsufficientFunds,
    gasFeesEth: quote?.gasCosts ? `(${formatWei(quote.gasCosts, 18)} ETH)` : '',
    gasFeesUsd: quote?.gasCostsInUsd
      ? `$${formatAmount(quote.gasCostsInUsd)}`
      : '',
    inputAmount,
    inputAmoutUsd,
    inputTokenBalance: balance,
    inputTokenBalanceFormatted: balanceFormatted,
    isFetchingQuote,
    outputAmount,
    outputAmounts,
    outputAmountsUsd,
    outputAmountUsd,
    shouldShowSummaryDetails,
    forceRefetch,
  }
}
