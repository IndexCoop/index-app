import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import {
  eligibleLeveragedExchangeIssuanceTokens,
  ETH,
  icETHIndex,
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
      leveragedExchangeIssuanceData:
        | LeveragedExchangeIssuanceQuote
        | null
        | undefined
    }
  | { success: false; error: E }

/* Determines if the token is eligible for Leveraged Exchange Issuance */
const isEligibleLeveragedToken = (token: Token) =>
  eligibleLeveragedExchangeIssuanceTokens.includes(token)

/* Determines if the token pair is eligible for Leveraged Exchange Issuance */
const isEligibleTradePair = (
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
    // Only ETH is allowed as input for icETH issuance at the moment
    return inputToken.symbol === ETH.symbol
  }

  if (tokenEligible && isIcEth && !isIssuance) {
    // Only ETH is allowed as output for icETH redeeming at the moment
    return outputToken.symbol === ETH.symbol
  }

  return tokenEligible
}

export const useBestTradeOption = () => {
  const { account, chainId, library } = useEthers()

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [result, setResult] = useState<Result<ZeroExData, Error> | null>(null)

  const fetchAndCompareOptions = async (
    sellToken: Token,
    sellTokenAmount: string,
    buyToken: Token,
    // buyTokenAmount: string,
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
    console.log('dexSwapOption', dexSwapOption)

    const tokenEligible = isEligibleTradePair(sellToken, buyToken, isIssuance)

    console.log('buyToken', buyToken)
    console.log('isBuyingTokenEligible', tokenEligible)

    const tokenAmount =
      isIssuance && dexSwapOption
        ? BigNumber.from(dexSwapOption.buyAmount)
        : toWei(sellTokenAmount, sellToken.decimals)

    /* Check for Exchange Issuance option */
    let exchangeIssuanceOption: ExchangeIssuanceQuote | null | undefined =
      undefined
    // if (account && !isBuyingTokenEligible) {
    //   console.log('Getting zeroex ei option')
    //   try {
    //     exchangeIssuanceOption = await getExchangeIssuanceQuotes(
    //       buyToken,
    //       tokenAmount,
    //       sellToken,
    //       isIssuance,
    //       chainId,
    //       library
    //     )
    //   } catch (e) {
    //     console.warn('error when generating zeroexei option', e)
    //   }
    // }

    /* Check ExchangeIssuanceLeveraged option */
    let leveragedExchangeIssuanceOption: LeveragedExchangeIssuanceQuote | null =
      null
    // temporary just allowing icETH until all tokens tested
    // if (account && !dexSwapError && tokenEligible) {
    if (account && tokenEligible) {
      const setToken = isIssuance ? buyToken : sellToken
      const setAmount = tokenAmount
      console.log(
        'Getting leveraged ei option',
        isIssuance,
        setToken,
        setAmount,
        'sell token',
        sellToken
      )

      try {
        leveragedExchangeIssuanceOption =
          await getLeveragedExchangeIssuanceQuotes(
            setToken,
            setAmount,
            sellToken,
            isIssuance,
            chainId,
            library
          )
      } catch (e) {
        console.warn('error when generating leveraged ei option', e)
      }
    }

    console.log('exchangeIssueOption', exchangeIssuanceOption)
    console.log(
      'exchangeIssueLeveragedOption',
      leveragedExchangeIssuanceOption,
      'dex swap',
      dexSwapOption
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
