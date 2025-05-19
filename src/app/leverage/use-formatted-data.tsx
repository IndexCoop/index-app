import { useMemo } from 'react'

import { useFormattedBalance } from '@/components/swap/hooks/use-swap/use-formatted-balance'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatAmount, formatDollarAmount, formatWei } from '@/lib/utils'

import { useLeverageToken } from './provider'

export interface FormattedLeverageData {
  hasInsufficientFunds: boolean
  gasFeesEth: string
  gasFeesUsd: string
  contract: string | null
  inputAmount: string
  inputAmoutUsd: string
  inputBalance: bigint
  inputBalanceFormatted: string
  isFetchingQuote: boolean
  outputAmount: string
  outputAmountUsd: string
  quoteAmount: string
  quoteAmountUsd: string
  orderFee: string
  orderFeePercent: string
  priceImpactUsd: string
  priceImpactPercent: string
  resetData: () => void
  shouldShowSummaryDetails: boolean
  shouldShowWarning: boolean
}

export function useFormattedLeverageData(): FormattedLeverageData {
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

  console.log('quote', quote)

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

  const outputAmount = useMemo(() => {
    if (inputValue === '') return ''
    if (!quote?.outputTokenAmount) return ''
    const amount = Number(
      formatWei(quote?.outputTokenAmount, quote?.outputToken.decimals),
    )
    const digits = getFormatWithDigits(amount)
    return `${formatAmount(amount, digits)} ${quote?.outputToken.symbol}`
  }, [inputValue, quote])
  const outputAmountUsd = quote?.outputTokenAmountUsd
    ? `$${formatAmount(quote?.outputTokenAmountUsd)}`
    : ''

  const quoteAmount = useMemo(() => {
    if (!quote) return ''
    const amount = Number(
      formatWei(
        quote.quoteAmount,
        quote.isMinting
          ? quote.inputToken.decimals
          : quote.outputToken.decimals,
      ),
    )
    const symbol = quote.isMinting
      ? quote.inputToken.symbol
      : quote.outputToken.symbol
    const digits = getFormatWithDigits(amount)
    return `${formatAmount(amount, digits)} ${symbol}`
  }, [quote])
  const quoteAmountUsd = useMemo(() => {
    if (!quote?.quoteAmountUsd) return ''
    return `$${formatAmount(quote?.quoteAmountUsd)}`
  }, [quote])

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

  const shouldShowWarning = useMemo(() => {
    if (quote?.warning) return true
    return false
  }, [quote])

  const shouldShowSummaryDetails = useMemo(
    () => quote !== null && inputValue !== '',
    [inputValue, quote],
  )

  const { orderFee, orderFeePercent } = useMemo(() => {
    if (!quote || quote.fees === null)
      return { orderFee: '', orderFeePercent: '' }
    const mintRedeemFees = quote.isMinting ? quote.fees.mint : quote.fees.redeem
    const mintRedeemFeesUsd = quote.inputTokenAmountUsd * mintRedeemFees
    const orderFeePercent = (
      (quote.isMinting ? quote.fees.mint : quote.fees.redeem) * 100
    ).toFixed(2)
    return { orderFee: `$${mintRedeemFeesUsd.toFixed(2)}`, orderFeePercent }
  }, [quote])

  const priceImpactUsd = useMemo(
    () => `$${quote?.priceImpactUsd?.toFixed(2) ?? ''}`,
    [quote],
  )
  const priceImpactPercent = useMemo(
    () => `(${quote?.priceImpactPercent?.toFixed(2) ?? ''}%)`,
    [quote],
  )

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
    outputAmount,
    outputAmountUsd,
    quoteAmount,
    quoteAmountUsd,
    orderFee,
    orderFeePercent,
    priceImpactUsd,
    priceImpactPercent,
    resetData,
    shouldShowSummaryDetails,
    shouldShowWarning,
  }
}

function getFormatWithDigits(amount: number) {
  return amount < 0.01 ? Math.min(6, Math.ceil(-Math.log10(amount)) + 1) : 2
}
