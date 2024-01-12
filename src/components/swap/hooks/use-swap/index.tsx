import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { formatUnits } from 'viem'

import { Token } from '@/constants/tokens'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSlippage } from '@/lib/providers/slippage'
import { toWei } from '@/lib/utils'

import { TradeDetailTokenPrices } from '../../components/trade-details'
import { TradeInfoItem } from '../../types'

import {
  formattedFiat,
  getFormattedTokenPrices,
  getHasInsufficientFunds,
  shouldShowWarningSign,
} from './formatters'
import { getFormattedPriceImpact } from './formatters/price-impact'
import { buildTradeDetails } from './trade-details-builder'
import { useFormattedBalance } from './use-formatted-balance'

interface SwapData {
  contract: string | null
  isFlashMint: boolean
  hasInsufficientFunds: boolean
  //   inputTokenAmountFormatted: string
  inputTokenBalance: string
  inputTokenBalanceFormatted: string
  inputTokenAmountUsd: string
  inputTokenAmountWei: BigNumber
  inputTokenPrice: number
  outputTokenAmountFormatted: string
  outputTokenAmountUsd: string
  outputTokenBalanceFormatted: string
  outputTokenPrice: number
  gasCostsUsd: number
  priceImpactFormatting: {
    colorCoding: string
    priceImpact: string
  } | null
  // Trade details
  showWarning: boolean
  tokenPrices: TradeDetailTokenPrices
  tradeData: TradeInfoItem[]
}

const formatAmount = (amount: number, decimals = 2) =>
  amount.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  })

function getFormattedOuputTokenAmount(quoteResult: QuoteResult | null): string {
  if (!quoteResult) return '0'
  const isFlashmintBestQuote = quoteResult.bestQuote === QuoteType.flashmint
  const quote = isFlashmintBestQuote
    ? quoteResult.quotes.flashmint
    : quoteResult.quotes.zeroex
  if (!quote) return '0'
  const outputTokenAmount = quote.isMinting
    ? quote.indexTokenAmount
    : quote.inputOutputTokenAmount
  const outputAmount = Number(
    formatUnits(
      BigInt(outputTokenAmount.toString()),
      quote.outputToken.decimals
    )
  )
  const decimals = outputAmount > 1 ? 2 : 4
  return formatAmount(outputAmount, decimals)
}

export function useSwap(
  inputToken: Token,
  outputToken: Token,
  inputTokenAmount: string,
  quoteResult: QuoteResult | null,
  isFetchingQuote: boolean,
  selectedQuoteType: QuoteType | null
): SwapData {
  const { slippage } = useSlippage()
  const { address } = useWallet()

  const {
    balance,
    balanceFormatted: inputTokenBalanceFormatted,
    balanceWei: inputTokenBalance,
  } = useFormattedBalance(inputToken, address ?? '')
  const { balanceFormatted: outputTokenBalanceFormatted } = useFormattedBalance(
    outputToken,
    address ?? ''
  )

  const selectedQuote = useMemo(
    () =>
      selectedQuoteType === null ||
      selectedQuoteType === QuoteType.zeroex ||
      quoteResult === null
        ? quoteResult?.quotes.zeroex
        : quoteResult?.quotes.flashmint,
    [quoteResult, selectedQuoteType]
  )
  const isFlashMint = useMemo(
    () => selectedQuote?.type === QuoteType.flashmint,
    [selectedQuote]
  )

  const contract = useMemo(
    () => selectedQuote?.contract ?? null,
    [selectedQuote]
  )

  const inputTokenAmountUsd = useMemo(
    () => formattedFiat(selectedQuote?.inputTokenAmountUsd ?? 0),
    [selectedQuote]
  )

  const inputTokenAmountWei = useMemo(
    () => toWei(inputTokenAmount, inputToken.decimals),
    [inputToken, inputTokenAmount]
  )

  const hasInsufficientFunds = useMemo(
    () =>
      getHasInsufficientFunds(
        false,
        inputTokenAmountWei,
        BigNumber.from(balance.toString())
      ),
    [balance, inputTokenAmountWei]
  )

  const outputTokenAmountFormatted = useMemo(
    () => getFormattedOuputTokenAmount(quoteResult),
    [quoteResult]
  )

  const outputTokenAmountUsd = useMemo(
    () => formattedFiat(selectedQuote?.outputTokenAmountUsd ?? 0),
    [selectedQuote]
  )
  const gasCostsUsd = selectedQuote?.gasCostsInUsd ?? 0

  const priceImpact = useMemo(() => selectedQuote?.priceImpact, [selectedQuote])
  const priceImpactFormatting = useMemo(
    () =>
      isFetchingQuote || !priceImpact
        ? null
        : getFormattedPriceImpact(priceImpact, false),
    [isFetchingQuote, priceImpact]
  )

  // Trade details
  const showWarning = useMemo(() => shouldShowWarningSign(slippage), [slippage])
  const tokenPrices = useMemo(
    () =>
      getFormattedTokenPrices(
        inputToken.symbol,
        Number(inputTokenAmount),
        selectedQuote?.inputTokenPrice ?? 0,
        outputToken.symbol,
        Number(
          formatUnits(
            BigInt(selectedQuote?.outputTokenAmount.toString() ?? '0'),
            outputToken.decimals
          )
        ),
        selectedQuote?.outputTokenPrice ?? 0
      ),
    [inputToken, inputTokenAmount, outputToken, selectedQuote]
  )

  // Trade data
  const tradeData: TradeInfoItem[] = buildTradeDetails(quoteResult)

  return {
    contract,
    isFlashMint,
    hasInsufficientFunds,
    gasCostsUsd,
    inputTokenAmountUsd,
    inputTokenAmountWei,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    inputTokenPrice: selectedQuote?.inputTokenPrice ?? 0,
    outputTokenAmountFormatted,
    outputTokenAmountUsd,
    outputTokenBalanceFormatted,
    outputTokenPrice: selectedQuote?.outputTokenPrice ?? 0,
    priceImpactFormatting,
    showWarning,
    tokenPrices,
    tradeData,
  }
}
