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
} from 'utils/exchangeIssuanceQuotes'
import { getZeroExTradeData, ZeroExData } from 'utils/zeroExUtils'

type Result<_, E = Error> =
  | {
      success: true
      dexData: ZeroExData | null
      exchangeIssuanceData: ExchangeIssuanceQuote | null | undefined
      // TODO: add quote type if it differs
      leveragedExchangeIssuanceData: ExchangeIssuanceQuote | null | undefined
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

    const tokenAmount =
      isIssuance && dexSwapOption
        ? BigNumber.from(dexSwapOption.buyAmount)
        : toWei(sellTokenAmount, sellToken.decimals)

    /* Check for Exchange Issuance option */
    let exchangeIssuanceOption: ExchangeIssuanceQuote | null | undefined =
      undefined
    if (account && !isBuyingTokenEligible) {
      exchangeIssuanceOption = await getExchangeIssuanceQuotes(
        buyToken,
        tokenAmount,
        sellToken,
        isIssuance,
        chainId,
        library
      )
    }

    /* Check ExchangeIssuanceLeveraged option */
    let exchangeIssueLeveragedOption = undefined
    if (account && isBuyingTokenEligible) {
      // TODO:
      //   const tx = await getLeveragedTokenData(
      //     library,
      //     setToken,
      //     setTokenAmount,
      //     isIssuance
      //   )
      //   const { debtAmount, debtToken, collateralAmount, collateralToken } = tx
      //   const { path, fees } = await getTokenPathAndFees(
      //     debtAmount,
      //     debtToken,
      //     collateralToken
      //   )
      // TODO: for correct format of swap data, check discord #fli-exchange-issuance
      //       {
      //   path: string[]
      //   fees: BigNumber[]
      // }
      // TODO: get leveraged exchange issue  quote
      // TODO: depending on isIssuance getIssueExactSet or getRedeemExactSet
      // TODO: probably just create a utility function here as well (like getExchangeIssuanceQuotes)
    }

    console.log('exchangeIssueOption', exchangeIssuanceOption)
    console.log('exchangeIssueLeveragedOption', exchangeIssueLeveragedOption)

    const result: Result<ZeroExData, Error> = dexSwapError
      ? { success: false, error: dexSwapError }
      : {
          success: true,
          dexData: dexSwapOption,
          exchangeIssuanceData: exchangeIssuanceOption,
          leveragedExchangeIssuanceData: exchangeIssueLeveragedOption,
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
