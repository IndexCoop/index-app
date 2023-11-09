import { BigNumber } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import { formatUnits } from '@ethersproject/units'

import { Token } from '@/constants/tokens'
import { ZeroExQuote } from '@/lib/hooks/useBestQuote'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useBalanceData } from '@/lib/providers/Balances'
import { useSlippage } from '@/lib/providers/slippage'
import { toWei } from '@/lib/utils'

import {
  formattedBalance,
  formattedFiat,
  getFormattedOuputTokenAmount,
  getFormattedTokenPrices,
  getHasInsufficientFunds,
  shouldShowWarningSign,
} from '../../_shared/QuickTradeFormatter'
import { useTokenPrice } from '@/lib/hooks/use-token-price'
import { TradeDetailTokenPrices } from '../components/trade-details'

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
}

export function useSwap(
  inputToken: Token,
  outputToken: Token,
  inputTokenAmount: string,
  quote0x: ZeroExQuote | null
): SwapData {
  const { isLoading: isLoadingBalance, getTokenBalance } = useBalanceData()
  const inputTokenPrice = useTokenPrice(inputToken)
  const outputTokenPrice = useTokenPrice(outputToken)
  const { chainId } = useNetwork()
  const { slippage } = useSlippage()

  const [inputTokenBalance, setInputTokenBalance] = useState('0')
  const [inputTokenBalanceFormatted, setInputTokenBalanceFormatted] =
    useState('0.0')
  const [outputTokenBalanceFormatted, setOutputTokenBalanceFormatted] =
    useState('0.0')

  useEffect(() => {
    if (isLoadingBalance) return
    const tokenBal = getTokenBalance(inputToken.symbol, chainId)
    const inputTokenBalance = formatUnits(
      getTokenBalance(inputToken.symbol, chainId) ?? '0.0',
      inputToken.decimals
    )
    setInputTokenBalance(inputTokenBalance)
    setInputTokenBalanceFormatted(formattedBalance(inputToken, tokenBal))
  }, [chainId, getTokenBalance, inputToken, isLoadingBalance])

  useEffect(() => {
    if (isLoadingBalance) return
    const tokenBal = getTokenBalance(outputToken.symbol, chainId)
    setOutputTokenBalanceFormatted(formattedBalance(outputToken, tokenBal))
  }, [chainId, getTokenBalance, isLoadingBalance, outputToken])

  const reset = () => {
    // TODO:
  }

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
        getTokenBalance(inputToken.symbol, chainId)
      ),
    [chainId, getTokenBalance, inputToken, inputTokenAmountWei]
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
  }
}
