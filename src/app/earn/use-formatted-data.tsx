import { useMemo } from 'react'

import { useFormattedBalance } from '@/components/swap/hooks/use-swap/use-formatted-balance'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatAmount, formatDollarAmount, formatWei } from '@/lib/utils'

import { useEarnContext } from './provider'

export interface FormattedEarnData {
  hasInsufficientFunds: boolean
  gasFeesEth: string
  gasFeesUsd: string
  contract: string | null
  inputAmount: string
  inputAmoutUsd: string
  inputBalance: bigint
  inputBalanceFormatted: string
  isFetchingQuote: boolean
  ouputAmount: string
  outputAmountUsd: string
  orderFee: string
  orderFeePercent: string
  priceImpactUsd: string
  priceImpactPercent: string
  resetData: () => void
  shouldShowSummaryDetails: boolean
}

export function useFormattedEarnData(): FormattedEarnData {
  const { address } = useWallet()
  const {
    inputToken,
    inputTokenAmount,
    inputValue,
    isFetchingQuote,
    quoteResult,
  } = useEarnContext()

  const {
    balance,
    balanceFormatted,
    forceRefetch: forceRefetchInputBalance,
  } = useFormattedBalance(inputToken, address)

  const quote = useMemo(() => quoteResult?.quote ?? null, [quoteResult])

  const contract = useMemo(() => quote?.contract ?? null, [quote])

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

  const ouputAmount = useMemo(() => {
    if (inputValue === '') return ''
    if (!quote?.outputTokenAmount) return ''
    const amount = Number(
      formatWei(quote?.outputTokenAmount, quote?.outputToken.decimals),
    )
    const digits =
      amount < 0.01 ? Math.min(6, Math.ceil(-Math.log10(amount)) + 1) : 2
    return `${formatAmount(amount, digits)} ${quote?.outputToken.symbol}`
  }, [inputValue, quote])
  const outputAmountUsd = quote?.outputTokenAmountUsd
    ? `$${formatAmount(quote?.outputTokenAmountUsd)}`
    : ''

  const resetData = () => {
    forceRefetchInputBalance()
  }

  const gasCosts = quote?.gasCosts
  let gasFeesEth = ''
  if (gasCosts) {
    gasFeesEth =
      gasCosts < BigInt(1000000000000000)
        ? '(<0.001 ETH)'
        : `(${Number(formatWei(gasCosts, 18)).toFixed(2)} ETH)`
  }

  const shouldShowSummaryDetails = useMemo(
    () => quote !== null && inputValue !== '',
    [inputValue, quote],
  )

  const orderFee =
    !quote || quote.fees === null
      ? ''
      : (quote.isMinting ? quote.fees.mintUsd : quote.fees.redeemUsd).toFixed(2)
  const orderFeePercent =
    !quote || quote.fees === null
      ? ''
      : (
          (quote.isMinting ? quote.fees.mint : quote.fees.redeem) * 100
        ).toString()

  console.log(orderFee, orderFeePercent, 'orderFee')

  const priceImpactUsd = `$${quote?.priceImpactUsd?.toFixed(2) ?? ''}`
  const priceImpactPercent = `(${quote?.priceImpactPercent?.toFixed(2) ?? ''}%)`

  return {
    hasInsufficientFunds,
    gasFeesEth,
    gasFeesUsd: quote?.gasCostsInUsd
      ? formatDollarAmount(quote.gasCostsInUsd)
      : '',
    contract,
    inputAmount,
    inputAmoutUsd,
    inputBalance: balance,
    inputBalanceFormatted: balanceFormatted,
    isFetchingQuote,
    ouputAmount,
    outputAmountUsd,
    orderFee,
    orderFeePercent,
    priceImpactUsd,
    priceImpactPercent,
    resetData,
    shouldShowSummaryDetails,
  }
}
