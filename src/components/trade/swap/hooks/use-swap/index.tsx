import { BigNumber } from 'ethers'
import { useMemo } from 'react'

import { Token } from '@/constants/tokens'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/useWallet'
import { useSlippage } from '@/lib/providers/slippage'
import { displayFromWei, toWei } from '@/lib/utils'

import {
  formattedFiat,
  getFormattedTokenPrices,
  getHasInsufficientFunds,
  shouldShowWarningSign,
} from '../../../_shared/QuickTradeFormatter'
import { TradeDetailTokenPrices } from '../../components/trade-details'
import { TradeInfoItem } from '../../types'

import { buildTradeDetails } from './trade-details-builder'
import { useFormattedBalance } from './use-formatted-balance'

interface SwapData {
  contract: string | null
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
  return displayFromWei(outputTokenAmount, quote.outputToken.decimals) ?? '0'
}

export function useSwap(
  inputToken: Token,
  outputToken: Token,
  inputTokenAmount: string,
  quoteResult: QuoteResult | null
): SwapData {
  const { address } = useWallet()
  const {
    balance,
    balanceFormatted: inputTokenBalanceFormatted,
    balanceWei: inputTokenBalance,
  } = useFormattedBalance(inputToken, address ?? '')
  // console.log(
  //   inputTokenBalanceFormatted,
  //   inputToken.symbol,
  //   address,
  //   'inputTokenBalanceFormatted'
  // )
  const { balanceFormatted: outputTokenBalanceFormatted } = useFormattedBalance(
    outputToken,
    address ?? ''
  )
  // console.log(
  //   outputTokenBalanceFormatted,
  //   outputToken.symbol,
  //   address,
  //   'outputTokenBalanceFormatted'
  // )

  const inputTokenPrice = useTokenPrice(inputToken)
  const outputTokenPrice = useTokenPrice(outputToken)
  const { slippage } = useSlippage()

  const selectedQuote = useMemo(
    () =>
      quoteResult?.bestQuote === QuoteType.zeroex
        ? quoteResult?.quotes.zeroex
        : quoteResult?.quotes.flashmint,
    [quoteResult]
  )

  const contract = selectedQuote?.contract ?? null

  const inputTokenAmountUsd = useMemo(
    () => formattedFiat(parseFloat(inputTokenAmount), inputTokenPrice),
    [inputTokenAmount, inputTokenPrice]
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
      formattedFiat(parseFloat(outputTokenAmountFormatted), outputTokenPrice),
    [outputTokenAmountFormatted, outputTokenPrice]
  )
  const gasCostsUsd = selectedQuote?.gasCostsInUsd ?? 0

  // Trade details
  const showWarning = useMemo(() => shouldShowWarningSign(slippage), [slippage])
  const tokenPrices = useMemo(
    () =>
      getFormattedTokenPrices(
        inputToken.symbol,
        inputTokenPrice,
        outputToken.symbol,
        outputTokenPrice
      ),
    [inputToken, inputTokenPrice, outputToken, outputTokenPrice]
  )

  // Trade data
  const tradeData: TradeInfoItem[] = buildTradeDetails(quoteResult)

  return {
    contract,
    hasInsufficientFunds,
    gasCostsUsd,
    inputTokenAmountUsd,
    inputTokenAmountWei,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    inputTokenPrice,
    outputTokenAmountFormatted,
    outputTokenAmountUsd,
    outputTokenBalanceFormatted,
    outputTokenPrice,
    showWarning,
    tokenPrices,
    tradeData,
  }
}
