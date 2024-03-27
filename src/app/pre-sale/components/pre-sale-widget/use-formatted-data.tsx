import { useMemo } from 'react'
import { formatUnits } from 'viem'

import { useFormattedBalance } from '@/components/swap/hooks/use-swap/use-formatted-balance'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatAmount } from '@/lib/utils'

import { useDeposit } from '../../providers/deposit-provider'
import { usePresaleData } from '../../providers/presale-provider'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'

export function useFormattedData() {
  const { address } = useWallet()
  const {
    inputTokenAmount,
    inputValue,
    isDepositing,
    preSaleCurrencyToken,
    preSaleToken,
    quoteResult,
  } = useDeposit()
  const { balance } = useFormattedBalance(preSaleToken, address)
  const {
    balance: currencyBalance,
    balanceFormatted: currencyBalanceFormatted,
  } = useFormattedBalance(preSaleCurrencyToken, address)
  const { formatted } = usePresaleData(preSaleToken.symbol)

  const quote = useMemo(() => quoteResult?.quote ?? null, [quoteResult])

  const inputAmount = quote?.inputTokenAmount
    ? `${formatAmount(Number(formatUnits(quote?.inputTokenAmount.toBigInt(), quote?.inputToken.decimals)))} ${quote?.inputToken.symbol}`
    : ''
  const inputAmoutUsd = quote?.inputTokenAmountUsd
    ? `$${formatAmount(quote?.inputTokenAmountUsd)}`
    : ''
  const inputTokenBalance = useMemo(
    () => (isDepositing ? currencyBalance : balance),
    [balance, currencyBalance, isDepositing],
  )

  const hasInsufficientFunds = useMemo(
    () => inputTokenBalance < inputTokenAmount,
    [inputTokenAmount, inputTokenBalance],
  )

  const ouputAmount = quote?.outputTokenAmount
    ? `${formatAmount(Number(formatUnits(quote?.outputTokenAmount.toBigInt(), quote?.outputToken.decimals)))} ${quote?.outputToken.symbol}`
    : ''
  const outputAmountUsd = quote?.outputTokenAmountUsd
    ? `$${formatAmount(quote?.outputTokenAmountUsd)}`
    : ''

  // TODO:
  const shouldShowSummaryDetails = useMemo(
    () => quote !== null && inputValue !== '',
    [quote],
  )

  return {
    currencyBalance: `${currencyBalanceFormatted}`,
    hasInsufficientFunds,
    gasFeesEth: quote?.gasCosts
      ? `(${formatUnits(quote.gasCosts.toBigInt(), 18)} ETH)`
      : '',
    gasFeesUsd: quote?.gasCostsInUsd
      ? `$${formatAmount(quote.gasCostsInUsd)}`
      : '',
    inputAmount,
    inputAmoutUsd,
    inputTokenBalance,
    ouputAmount,
    outputAmountUsd,
    shouldShowSummaryDetails,
    tvl: formatted.tvl,
    // As the conversion is 1-1 we can use the pre sale token balance 1-1 to show
    // how much the user deposited in terms of pre sale currency token
    userBalance: `${formatUnits(balance, preSaleToken.decimals)} ${preSaleCurrencyToken.symbol}`,
  }
}
