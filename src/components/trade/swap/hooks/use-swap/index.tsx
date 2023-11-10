import { BigNumber } from 'ethers'
import { useMemo } from 'react'

import { Token } from '@/constants/tokens'
import { ZeroExQuote } from '@/lib/hooks/useBestQuote'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/useWallet'
import { useSlippage } from '@/lib/providers/slippage'
import { toWei } from '@/lib/utils'

import {
  formattedFiat,
  getFormattedOuputTokenAmount,
  getFormattedTokenPrices,
  getHasInsufficientFunds,
  shouldShowWarningSign,
} from '../../../_shared/QuickTradeFormatter'
import { TradeDetailTokenPrices } from '../../components/trade-details'
import { TradeInfoItem } from '../../components/trade-details/trade-info'

import { buildTradeDetails } from './trade-details-builder'
import { useFormattedBalance } from './use-formatted-balance'

interface SwapData {
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

export function useSwap(
  inputToken: Token,
  outputToken: Token,
  inputTokenAmount: string,
  quote0x: ZeroExQuote | null
): SwapData {
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
  const inputTokenPrice = useTokenPrice(inputToken)
  const outputTokenPrice = useTokenPrice(outputToken)
  const { chainId } = useNetwork()
  const { slippage } = useSlippage()

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
    () =>
      // TODO:
      getFormattedOuputTokenAmount(
        false,
        outputToken.decimals,
        quote0x?.minOutput ?? BigNumber.from(0),
        BigNumber.from(0)
      ),
    [quote0x?.minOutput, outputToken]
  )

  const outputTokenAmountUsd = useMemo(
    () =>
      formattedFiat(parseFloat(outputTokenAmountFormatted), outputTokenPrice),
    [outputTokenAmountFormatted, outputTokenPrice]
  )
  const gasCostsUsd = quote0x?.gasCostsInUsd ?? 0

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
  const tradeData: TradeInfoItem[] = buildTradeDetails(quote0x, slippage)

  return {
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
