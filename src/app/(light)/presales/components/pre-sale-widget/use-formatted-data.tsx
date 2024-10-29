import { useMemo } from 'react'

import { useFormattedBalance } from '@/components/swap/hooks/use-swap/use-formatted-balance'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatAmount, formatWei } from '@/lib/utils'

import { useDeposit } from '../../providers/deposit-provider'
import { usePresaleData } from '../../providers/presale-provider'
import { usePrtRewards } from './use-rewards'

export function useFormattedData() {
  const { address } = useWallet()
  const {
    inputTokenAmount,
    inputValue,
    isDepositing,
    isFetchingQuote,
    preSaleCurrencyToken,
    preSaleToken,
    quoteResult,
  } = useDeposit()
  const {
    balance,
    balanceFormatted,
    forceRefetch: forceRefetchPreSaleTokenBalance,
  } = useFormattedBalance(preSaleToken, address)
  const {
    balance: currencyBalance,
    balanceFormatted: currencyBalanceFormatted,
    forceRefetch: forceRefetchPreSaleCurrencyTokenBalance,
  } = useFormattedBalance(preSaleCurrencyToken, address)
  const { formatted } = usePresaleData(preSaleToken.symbol)
  const { earnedRewards, refetch: refetchRewards } = usePrtRewards(
    address,
    preSaleToken.address,
  )

  const quote = useMemo(() => quoteResult?.quote ?? null, [quoteResult])

  const inputAmount = quote?.inputTokenAmount
    ? `${formatAmount(Number(formatWei(quote?.inputTokenAmount.toBigInt(), quote?.inputToken.decimals)))} ${quote?.inputToken.symbol}`
    : ''
  const inputAmoutUsd = quote?.inputTokenAmountUsd
    ? `$${formatAmount(quote?.inputTokenAmountUsd)}`
    : ''
  const inputTokenBalance = useMemo(
    () => (isDepositing ? currencyBalance : balance),
    [balance, currencyBalance, isDepositing],
  )
  const inputTokenBalanceFormatted = useMemo(
    () => (isDepositing ? currencyBalanceFormatted : balanceFormatted),
    [balanceFormatted, currencyBalanceFormatted, isDepositing],
  )

  const hasInsufficientFunds = useMemo(
    () => inputTokenBalance < inputTokenAmount,
    [inputTokenAmount, inputTokenBalance],
  )

  const ouputAmount = quote?.outputTokenAmount
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
    refetchRewards()
    forceRefetchPreSaleTokenBalance()
    forceRefetchPreSaleCurrencyTokenBalance()
  }

  return {
    currencyBalance: `${currencyBalanceFormatted}`,
    earnedRewards,
    hasInsufficientFunds,
    gasFeesEth: quote?.gasCosts
      ? `(${formatWei(quote.gasCosts.toBigInt(), 18)} ETH)`
      : '',
    gasFeesUsd: quote?.gasCostsInUsd
      ? `$${formatAmount(quote.gasCostsInUsd)}`
      : '',
    inputAmount,
    inputAmoutUsd,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    isFetchingQuote,
    ouputAmount,
    outputAmountUsd,
    shouldShowSummaryDetails,
    tvl: formatted.tvl,
    // As the conversion is 1-1 we can use the pre sale token balance 1-1 to show
    // how much the user deposited in terms of pre sale currency token
    userBalance: `${formatWei(balance, preSaleToken.decimals)} ${preSaleCurrencyToken.symbol}`,
    forceRefetch,
  }
}
