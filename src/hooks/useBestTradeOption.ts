import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import {
  eligibleLeveragedExchangeIssuanceTokens,
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

export const useBestTradeOption = () => {
  const { account, chainId, library } = useEthers()

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [result, setResult] = useState<Result<ZeroExData, Error> | null>(null)

  /* Determines if the token is eligible for Leveraged Exchange Issuance */
  const isEligibleLeveragedToken = (token: Token) =>
    eligibleLeveragedExchangeIssuanceTokens.includes(token)

  const fetchAndCompareOptions = async (
    sellToken: Token,
    sellTokenAmount: string,
    buyToken: Token,
    buyTokenAmount: string,
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

    const isBuyingTokenEligible = isEligibleLeveragedToken(buyToken)
    // console.log('buyToken', buyToken)
    // console.log('isBuyingTokenEligible', isBuyingTokenEligible)

    // const tokenAmount =
    //   isIssuance && dexSwapOption
    //     ? BigNumber.from(dexSwapOption.buyAmount)
    //     : toWei(sellTokenAmount, sellToken.decimals)

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
    const isIcEth = buyToken.symbol === 'icETH'
    if (account && isBuyingTokenEligible && isIcEth) {
      console.log('Getting leveraged ei option')
      const setToken = isIssuance ? buyToken : sellToken
      const setAmount = isIssuance ? buyTokenAmount : sellTokenAmount
      const paymentToken = isIssuance ? sellToken : buyToken
      try {
        leveragedExchangeIssuanceOption =
          await getLeveragedExchangeIssuanceQuotes(
            setToken,
            setAmount,
            paymentToken,
            isIssuance,
            chainId,
            library
          )
      } catch (e) {
        console.warn('error when generating leveraged ei option', e)
      }
    }

    console.log('exchangeIssueOption', exchangeIssuanceOption)
    console.log('exchangeIssueLeveragedOption', leveragedExchangeIssuanceOption)

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
