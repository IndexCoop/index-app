import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import { MAINNET } from 'constants/chains'
import {
  eligibleLeveragedExchangeIssuanceTokens,
  ETH,
  icETHIndex,
  JPGIndex,
  STETH,
  Token,
} from 'constants/tokens'
import { toWei } from 'utils'
import {
  ExchangeIssuanceQuote,
  getExchangeIssuanceQuotes,
  getLeveragedExchangeIssuanceQuotes,
  LeveragedExchangeIssuanceQuote,
} from 'utils/exchangeIssuanceQuotes'
import { getZeroExTradeData, ZeroExData } from 'utils/zeroExUtils'

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
  const { chainId, library } = useEthers()

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [result, setResult] = useState<Result<ZeroExData, Error> | null>(null)

  const fetchAndCompareOptions = async (
    sellToken: Token,
    sellTokenAmount: string,
    sellTokenPrice: number,
    buyToken: Token,
    // buyTokenAmount: string,
    buyTokenPrice: number,
    isIssuance: boolean
  ) => {
    setIsFetching(true)

    /* Check 0x for DEX Swap option*/
    const zeroExResult = await getZeroExTradeData(
      // for now we only allow selling
      true,
      sellToken,
      buyToken,
      // for now we only allow specifing selling amount,
      // so sell token amount will always be correct
      sellTokenAmount,
      chainId || 1
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

    const tokenEligibleForLeveragedEI = isEligibleTradePair(
      sellToken,
      buyToken,
      isIssuance
    )
    if (tokenEligibleForLeveragedEI) {
      const setToken = isIssuance ? buyToken : sellToken

      try {
        leveragedExchangeIssuanceOption =
          await getLeveragedExchangeIssuanceQuotes(
            setToken,
            setTokenAmount,
            sellToken,
            buyToken,
            isIssuance,
            chainId,
            library
          )
      } catch (e) {
        console.warn('error when generating leveraged ei option', e)
      }
    } else {
      const isIcEth =
        sellToken.symbol === icETHIndex.symbol ||
        buyToken.symbol === icETHIndex.symbol
      const isJpg =
        sellToken.symbol === JPGIndex.symbol ||
        buyToken.symbol === JPGIndex.symbol
      // For now only run on mainnet and if not icETH
      // icETH token pair (with non ETH token) could not be eligible and land here
      // temporarily - disabled JPG for EI
      if (chainId === MAINNET.chainId && !isIcEth && !isJpg)
        try {
          exchangeIssuanceOption = await getExchangeIssuanceQuotes(
            buyToken,
            setTokenAmount,
            sellToken,
            isIssuance,
            chainId,
            library
          )
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
