import { BigNumber } from 'ethers'
import { useMemo } from 'react'

import { Token } from '@/constants/tokens'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSlippage } from '@/lib/providers/slippage'
import { displayFromWei, toWei } from '@/lib/utils'

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
import { formatUnits } from 'viem'

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
  return displayFromWei(outputTokenAmount, 4, quote.outputToken.decimals) ?? '0'
}

export function useSwap(
  inputToken: Token,
  outputToken: Token,
  inputTokenAmount: string,
  quoteResult: QuoteResult | null,
  isFetchingQuote: boolean
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
      quoteResult?.bestQuote === QuoteType.zeroex
        ? quoteResult?.quotes.zeroex
        : quoteResult?.quotes.flashmint,
    [quoteResult]
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
    () =>
      formattedFiat(
        parseFloat(inputTokenAmount),
        selectedQuote?.inputTokenPrice ?? 0
      ),
    [inputTokenAmount, selectedQuote?.inputTokenPrice]
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
    () =>
      formattedFiat(
        parseFloat(outputTokenAmountFormatted),
        selectedQuote?.outputTokenPrice ?? 0
      ),
    [outputTokenAmountFormatted, selectedQuote]
  )
  const gasCostsUsd = selectedQuote?.gasCostsInUsd ?? 0

  const isDarkMode = false
  let inputTokenAmountAdjusted = inputTokenAmount
  if (quoteResult && quoteResult.bestQuote === QuoteType.flashmint) {
    inputTokenAmountAdjusted =
      displayFromWei(
        quoteResult.quotes.flashmint!.inputOutputTokenAmount,
        10,
        inputToken.decimals
      ) ?? inputTokenAmount
  }
  const priceImpactFormatting = useMemo(
    () =>
      isFetchingQuote || !selectedQuote
        ? null
        : getFormattedPriceImpact(
            parseFloat(inputTokenAmountAdjusted),
            selectedQuote.inputTokenPrice,
            parseFloat(outputTokenAmountFormatted),
            selectedQuote.outputTokenPrice,
            isDarkMode
          ),
    [
      inputTokenAmountAdjusted,
      isDarkMode,
      isFetchingQuote,
      outputTokenAmountFormatted,
      selectedQuote,
    ]
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
