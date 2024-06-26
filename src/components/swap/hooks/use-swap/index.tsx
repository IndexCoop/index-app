import { BigNumber } from 'ethers'
import { useMemo } from 'react'

import { Token } from '@/constants/tokens'
import { QuoteResults, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSlippage } from '@/lib/providers/slippage'
import { formatWei, parseUnits } from '@/lib/utils'

import { TradeDetailTokenPrices } from '../../components/trade-details'
import { TradeInfoItem } from '../../types'

import {
  formattedFiat,
  getFormattedTokenPrices,
  getHasInsufficientFunds,
  shouldShowWarningSign,
} from './formatters'
import {
  FormattedQuoteDisplay,
  getFormattedQuoteRedemptionResult,
  getFormattedQuoteResults,
} from './formatters/result'
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
  outputTokenPrice: number
  formattedQuoteResults: FormattedQuoteDisplay[]
  // Trade details
  showWarning: boolean
  tokenPrices: TradeDetailTokenPrices
  tradeData: TradeInfoItem[]
}

export function useSwap(
  inputToken: Token,
  outputToken: Token,
  inputTokenAmount: string,
  quoteResults: QuoteResults,
  selectedQuoteType: QuoteType | null,
  isFetchingQuote: boolean,
  isFetching0x: boolean,
  isFetchingFlashmint: boolean,
  isFetchingRedemption: boolean,
): SwapData {
  const { slippage } = useSlippage()
  const { address } = useWallet()

  const {
    balance,
    balanceFormatted: inputTokenBalanceFormatted,
    balanceWei: inputTokenBalance,
  } = useFormattedBalance(inputToken, address ?? '')

  const selectedQuote = useMemo(() => {
    if (selectedQuoteType === null)
      return quoteResults?.results.index?.quote ?? null
    if (selectedQuoteType === QuoteType.flashmint)
      return quoteResults?.results.flashmint?.quote ?? null
    if (selectedQuoteType === QuoteType.redemption)
      return quoteResults.results.redemption?.quote ?? null
    return quoteResults?.results.index?.quote ?? null
  }, [quoteResults, selectedQuoteType])
  const isFlashMint = useMemo(
    () => selectedQuote?.type === QuoteType.flashmint,
    [selectedQuote],
  )

  const contract = useMemo(
    () => selectedQuote?.contract ?? null,
    [selectedQuote],
  )

  const inputTokenAmountUsd = useMemo(
    () => formattedFiat(selectedQuote?.inputTokenAmountUsd ?? 0),
    [selectedQuote],
  )

  const inputTokenAmountWei = useMemo(
    () => parseUnits(inputTokenAmount, inputToken.decimals),
    [inputToken, inputTokenAmount],
  )

  const hasInsufficientFunds = useMemo(
    () =>
      getHasInsufficientFunds(
        false,
        BigNumber.from(inputTokenAmountWei.toString()),
        BigNumber.from(balance.toString()),
      ),
    [balance, inputTokenAmountWei],
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
          formatWei(
            BigInt(selectedQuote?.outputTokenAmount.toString() ?? '0'),
            outputToken.decimals,
          ),
        ),
        selectedQuote?.outputTokenPrice ?? 0,
      ),
    [inputToken, inputTokenAmount, outputToken, selectedQuote],
  )

  const isRedemption = useMemo(
    () => quoteResults.bestQuote === QuoteType.redemption,
    [quoteResults.bestQuote],
  )
  // Formatted quote results
  const formattedQuoteResults = isRedemption
    ? getFormattedQuoteRedemptionResult(quoteResults, isFetchingRedemption)
    : getFormattedQuoteResults(quoteResults, isFetching0x, isFetchingFlashmint)

  // Trade data
  const tradeData: TradeInfoItem[] = isRedemption
    ? []
    : buildTradeDetails(selectedQuote ?? null)

  return {
    contract,
    isFlashMint,
    hasInsufficientFunds,
    inputTokenAmountUsd,
    inputTokenAmountWei: BigNumber.from(inputTokenAmountWei.toString()),
    inputTokenBalance,
    inputTokenBalanceFormatted,
    inputTokenPrice: selectedQuote?.inputTokenPrice ?? 0,
    outputTokenPrice: selectedQuote?.outputTokenPrice ?? 0,
    formattedQuoteResults,
    showWarning,
    tokenPrices,
    tradeData,
  }
}
