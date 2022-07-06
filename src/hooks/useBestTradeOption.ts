import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import {
  getExchangeIssuanceLeveragedQuote,
  getExchangeIssuanceZeroExQuote,
  SwapData,
  ZeroExApi,
} from '@indexcoop/index-exchange-issuance-sdk'

import { MAINNET } from 'constants/chains'
import { IndexApiBaseUrl } from 'constants/server'
import {
  eligibleLeveragedExchangeIssuanceTokens,
  ETH,
  icETHIndex,
  IndexToken,
  JPGIndex,
  STETH,
  Token,
} from 'constants/tokens'
import { useAccount } from 'hooks/useAccount'
import { useBalance } from 'hooks/useBalance'
import { useNetwork } from 'hooks/useNetwork'
import { toWei } from 'utils'
import { getExchangeIssuanceGasEstimate } from 'utils/exchangeIssuanceGasEstimate'
import { getAddressForToken } from 'utils/tokens'
import {
  getNetworkKey,
  getZeroExTradeData,
  ZeroExData,
} from 'utils/zeroExUtils'

export interface ExchangeIssuanceQuote {
  tradeData: string[]
  inputTokenAmount: BigNumber
  setTokenAmount: BigNumber
  gas: BigNumber
}

export type LeveragedExchangeIssuanceQuote = {
  swapDataDebtCollateral: SwapData
  swapDataPaymentToken: SwapData
  inputTokenAmount: BigNumber
  setTokenAmount: BigNumber
}

type Result<_, E = Error> =
  | {
      success: true
      dexData: ZeroExData | null
      exchangeIssuanceData: ExchangeIssuanceQuote | null | undefined
      leveragedExchangeIssuanceData: LeveragedExchangeIssuanceQuote | null
    }
  | { success: false; error: E }

// To determine if price impact for DEX is smaller 5%
export const maxPriceImpact = 5

/* Determines if the token is eligible for Leveraged Exchange Issuance */
const isEligibleLeveragedToken = (token: Token) =>
  eligibleLeveragedExchangeIssuanceTokens.includes(token)

export function isEligibleTradePairZeroEx(
  inputToken: Token,
  outputToken: Token
): boolean {
  if (
    inputToken.symbol === icETHIndex.symbol ||
    outputToken.symbol === icETHIndex.symbol
  )
    return false

  if (
    inputToken.symbol === IndexToken.symbol ||
    outputToken.symbol === IndexToken.symbol
  )
    return false

  if (
    inputToken.symbol === JPGIndex.symbol ||
    outputToken.symbol === JPGIndex.symbol
  )
    // temporarily - disabled JPG for EI0x
    return false

  return true
}

/* Determines if the token pair is eligible for Leveraged Exchange Issuance */
export const isEligibleTradePair = (
  inputToken: Token,
  outputToken: Token,
  isIssuance: boolean
) => {
  const tokenEligible = isIssuance
    ? isEligibleLeveragedToken(outputToken)
    : isEligibleLeveragedToken(inputToken)

  const isIcEth =
    inputToken.symbol === icETHIndex.symbol ||
    outputToken.symbol === icETHIndex.symbol

  if (tokenEligible && isIcEth && isIssuance) {
    // Only ETH or stETH is allowed as input for icETH issuance at the moment
    return (
      inputToken.symbol === ETH.symbol || inputToken.symbol === STETH.symbol
    )
  }

  if (tokenEligible && isIcEth && !isIssuance) {
    // Only ETH is allowed as output for icETH redeeming at the moment
    return outputToken.symbol === ETH.symbol
  }

  return tokenEligible
}

export const getSetTokenAmount = (
  isIssuance: boolean,
  sellTokenAmount: string,
  sellTokenDecimals: number,
  sellTokenPrice: number,
  buyTokenPrice: number,
  dexSwapOption: ZeroExData | null
): BigNumber => {
  if (!isIssuance) {
    return toWei(sellTokenAmount, sellTokenDecimals)
  }

  let setTokenAmount = BigNumber.from(dexSwapOption?.buyAmount ?? '0')

  const priceImpact =
    dexSwapOption && dexSwapOption.estimatedPriceImpact
      ? parseFloat(dexSwapOption.estimatedPriceImpact)
      : 0

  if (!dexSwapOption || priceImpact >= maxPriceImpact) {
    // Recalculate the exchange issue/redeem quotes if not enough DEX liquidity
    const sellTokenTotal = parseFloat(sellTokenAmount) * sellTokenPrice
    const approxOutputAmount =
      buyTokenPrice === 0 ? 0 : Math.floor(sellTokenTotal / buyTokenPrice)
    setTokenAmount = toWei(approxOutputAmount, sellTokenDecimals)
  }

  return setTokenAmount
}

export const useBestTradeOption = () => {
  const { provider } = useAccount()
  const { chainId } = useNetwork()
  const { getBalance } = useBalance()

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [result, setResult] = useState<Result<ZeroExData, Error> | null>(null)

  /**
   *
   * @param slippage   The max acceptable slippage, e.g. 3 for 3 %
   */
  const fetchAndCompareOptions = async (
    sellToken: Token,
    sellTokenAmount: string,
    sellTokenPrice: number,
    buyToken: Token,
    // buyTokenAmount: string,
    buyTokenPrice: number,
    isIssuance: boolean,
    slippage: number
  ) => {
    const inputTokenAddress = getAddressForToken(sellToken, chainId)
    const outputTokenAddress = getAddressForToken(buyToken, chainId)

    if (!provider || !chainId) {
      console.error('Error - no provider or chain id present')
      return
    }

    if (!inputTokenAddress || !outputTokenAddress) {
      console.log(inputTokenAddress, outputTokenAddress)
      console.error('Error can not determine input/ouput token address')
      return
    }

    setIsFetching(true)

    const slippagePercentage = slippage / 100
    /* Check 0x for DEX Swap option*/
    const zeroExResult = await getZeroExTradeData(
      // for now we only allow selling
      true,
      sellToken,
      buyToken,
      // for now we only allow specifing selling amount,
      // so sell token amount will always be correct
      sellTokenAmount,
      slippagePercentage,
      chainId
    )
    const dexSwapOption = zeroExResult.success ? zeroExResult.value : null
    const dexSwapError = zeroExResult.success ? null : zeroExResult.error

    /* Determine set token amount based on different factors */
    let setTokenAmount = getSetTokenAmount(
      isIssuance,
      sellTokenAmount,
      sellToken.decimals,
      sellTokenPrice,
      buyTokenPrice,
      dexSwapOption
    )

    /* Check for Exchange Issuance option */
    let exchangeIssuanceOption: ExchangeIssuanceQuote | null = null
    let leveragedExchangeIssuanceOption: LeveragedExchangeIssuanceQuote | null =
      null

    // Create an instance of ZeroExApi (to pass to quote functions)
    const affilliateAddress = '0x37e6365d4f6aE378467b0e24c9065Ce5f06D70bF'
    const networkKey = getNetworkKey(chainId)
    const swapPathOverride = `/${networkKey}/swap/v1/quote`
    const zeroExApi = new ZeroExApi(
      `${IndexApiBaseUrl}/0x`,
      affilliateAddress,
      swapPathOverride
    )

    const inputToken = {
      symbol: sellToken.symbol,
      decimals: sellToken.decimals,
      address: inputTokenAddress,
    }
    const outputToken = {
      symbol: buyToken.symbol,
      decimals: buyToken.decimals,
      address: outputTokenAddress,
    }

    const tokenEligibleForLeveragedEI = isEligibleTradePair(
      sellToken,
      buyToken,
      isIssuance
    )
    if (tokenEligibleForLeveragedEI) {
      try {
        const quoteLeveraged = await getExchangeIssuanceLeveragedQuote(
          inputToken,
          outputToken,
          setTokenAmount,
          isIssuance,
          slippage,
          zeroExApi,
          provider,
          chainId ?? 1
        )
        if (quoteLeveraged) {
          leveragedExchangeIssuanceOption = {
            swapDataDebtCollateral: quoteLeveraged.swapDataDebtCollateral,
            swapDataPaymentToken: quoteLeveraged.swapDataPaymentToken,
            inputTokenAmount: quoteLeveraged.inputOutputTokenAmount,
            setTokenAmount: quoteLeveraged.setTokenAmount,
          }
        }
        console.log(slippage, slippagePercentage, quoteLeveraged)
      } catch (e) {
        console.warn('error when generating leveraged ei option', e)
      }
    } else {
      // For now only allow trade on mainnet, some tokens are disabled
      const isEligibleTradePair = isEligibleTradePairZeroEx(sellToken, buyToken)
      if (chainId === MAINNET.chainId && isEligibleTradePair)
        try {
          const spendingTokenBalance: BigNumber =
            getBalance(sellToken.symbol) || BigNumber.from(0)
          const quote0x = await getExchangeIssuanceZeroExQuote(
            inputToken,
            outputToken,
            setTokenAmount,
            isIssuance,
            slippage,
            zeroExApi,
            provider,
            chainId
          )
          if (quote0x) {
            const gasEstimate = await getExchangeIssuanceGasEstimate(
              provider,
              chainId,
              isIssuance,
              sellToken,
              buyToken,
              setTokenAmount,
              quote0x.inputOutputTokenAmount,
              spendingTokenBalance,
              quote0x.componentQuotes
            )
            exchangeIssuanceOption = {
              tradeData: quote0x.componentQuotes,
              inputTokenAmount: quote0x.inputOutputTokenAmount,
              setTokenAmount: quote0x.setTokenAmount,
              gas: gasEstimate,
            }
          }
        } catch (e) {
          console.warn('error when generating zeroexei option', e)
        }
    }

    console.log(
      'exchangeIssuanceOption',
      exchangeIssuanceOption,
      exchangeIssuanceOption?.inputTokenAmount.toString()
    )
    console.log(
      'levExchangeIssuanceOption',
      leveragedExchangeIssuanceOption,
      leveragedExchangeIssuanceOption?.inputTokenAmount.toString()
    )

    const result: Result<ZeroExData, Error> = dexSwapError
      ? { success: false, error: dexSwapError }
      : {
          success: true,
          dexData: dexSwapOption,
          exchangeIssuanceData: exchangeIssuanceOption,
          leveragedExchangeIssuanceData: leveragedExchangeIssuanceOption,
        }
    setResult(result)
    setIsFetching(false)
  }

  return {
    bestOptionResult: result,
    isFetchingTradeData: isFetching,
    fetchAndCompareOptions,
  }
}
