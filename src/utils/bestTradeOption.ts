import { useEffect, useState } from 'react'

import { ethers } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { Token as UniswapToken } from '@uniswap/sdk-core'
import { useEthers } from '@usedapp/core'

import {
  Bitcoin2xFLIP,
  eligibleLeveragedExchangeIssuanceTokens,
  ETH,
  IBitcoinFLIP,
  MATIC,
  Token,
} from 'constants/tokens'
import {
  Exchange,
  useExchangeIssuanceLeveraged,
} from 'hooks/useExchangeIssuanceLeveraged'
import { useExchangeIssuanceZeroEx } from 'hooks/useExchangeIssuanceZeroEx'
import { displayFromWei, getChainAddress, toWei } from 'utils'
import { getExchangeIssuanceQuotes } from 'utils/exchangeIssuanceQuotes'
import { getIssuanceModule } from 'utils/issuanceModule'
import { getTokenPathAndFees } from 'utils/pathsAndFees'
import { getZeroExTradeData, ZeroExData } from 'utils/zeroExUtils'

type Result<T, E = Error> =
  | { success: true; data: T | null }
  | { success: false; error: E }

export const useBestTradeOption = () => {
  const {
    getLeveragedTokenData,
    issueExactSetFromERC20,
    issueExactSetFromETH,
    redeemExactSetForERC20,
    redeemExactSetForETH,
  } = useExchangeIssuanceLeveraged()
  const { chainId, library } = useEthers()

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [isLeveragedEI, setIsLeveragedEI] = useState<boolean>(false)
  const [isZeroExEI, setIsZeroExEI] = useState<boolean>(false)
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
      // TODO: isExact input should be isIssuance?
      true,
      sellToken,
      buyToken,
      // TODO: buy/sell token amount needs to switch depending on state?
      sellTokenAmount,
      chainId || 1
    )
    const dexSwapOption = zeroExResult.success ? zeroExResult.value : null
    const dexSwapError = zeroExResult.success ? null : zeroExResult.error
    console.log('dexSwapOption', dexSwapOption)

    const tokenAmount =
      isIssuance && dexSwapOption
        ? BigNumber.from(dexSwapOption.buyAmount)
        : toWei(sellTokenAmount, sellToken.decimals)
    // TODO: get issuance module here and pass it to function?
    // TODO: only run if not isEligibleLeveragedToken?
    const resultExchangeIssuance = await getExchangeIssuanceQuotes(
      buyToken,
      tokenAmount,
      sellToken,
      chainId,
      library
    )
    console.log(resultExchangeIssuance)

    /* Check ExchangeIssuanceLeveraged option */
    let exchangeIssueLeveragedOption = undefined
    // Currently only relevant for polygon network
    if (chainId === 137) {
      // If the user is issuing a token, then it compares the amount based on the
      // buy amount from the dex swap option, otherwise will redeem all the sell amount
      // TODO: check this
      const isSellingETH = sellToken.symbol === MATIC.symbol
      const isBuyingETH = buyToken.symbol === MATIC.symbol
      const isBuyingTokenEligible = isEligibleLeveragedToken(buyToken)
      const isSellingTokenEligible = isEligibleLeveragedToken(sellToken)

      if (isSellingETH && isIssuance && isBuyingTokenEligible) {
        const setToken = getChainAddress(buyToken, chainId) || ''
        const setTokenAmount = tokenAmount
        const tx = await getLeveragedTokenData(
          library,
          setToken,
          setTokenAmount,
          isIssuance
        )
        const { debtAmount, debtToken, collateralAmount, collateralToken } = tx
        const { path, fees } = await getTokenPathAndFees(
          debtAmount,
          debtToken,
          collateralToken
        )
        console.log(
          'levtokendata',
          tx,
          debtToken,
          debtAmount.toString(),
          collateralToken,
          collateralAmount.toString()
        )
        // exchangeIssueLeveragedOption = await issueExactSetFromETH(
        //   library,
        //   setToken,
        //   setTokenAmount,
        //   Exchange.UniV3,
        //   [[debtToken], [debtAmount]],
        //   [[collateralToken], [collateralAmount]]
        // )
      } else if (!isSellingETH && isIssuance && isBuyingTokenEligible) {
        // exchangeIssueLeveragedOption = await issueExactSetFromERC20(
        //   library,
        //   getChainAddress(buyToken, chainId) || '',
        //   BigNumber.from(buyTokenAmount),
        //   getChainAddress(sellToken, chainId) || '',
        //   BigNumber.from(sellTokenAmount),
        //   Exchange.UniV3,
        //   sellToken, //wrong
        //   buyToken //wrong
        // )
      } else if (isBuyingETH && !isIssuance && isSellingTokenEligible) {
        // exchangeIssueLeveragedOption = await redeemExactSetForETH(
        //   library,
        //   BigNumber.from(sellTokenAmount),
        //   BigNumber.from(buyTokenAmount),
        //   Exchange.UniV3,
        //   sellToken, //wrong
        //   buyToken //wrong
        // )
      } else if (!isBuyingETH && !isIssuance && isSellingTokenEligible) {
        // exchangeIssueLeveragedOption = await redeemExactSetForERC20(
        //   library,
        //   getChainAddress(sellToken, chainId) || '',
        //   BigNumber.from(sellTokenAmount),
        //   getChainAddress(buyToken, chainId) || '',
        //   BigNumber.from(buyTokenAmount),
        //   Exchange.UniV3,
        //   'sellToken', //wrong
        //   'buyToken' //wrong
        // )
      }
    }

    console.log('exchangeIssueLeveragedOption', exchangeIssueLeveragedOption)
    /* NOW COMPARE */
    // Checking via exchange issuance
    // const buyTokenAmount = option1Data.minOutput
    // const option2Data = await getTradeDataFromExchangeIssuance(buyTokenAmount)
    // TODO: Set isZeroExEI to true if is zeroExEI otherwise false
    // TODO: Set isLeveragedEI to true if is leveragedEI otherwise false

    // TODO: compare and return best option

    // TODO: extend result for success to either hold dexOption, exchangeIssuanceOption, levExchangeIssuanceOption
    const result: Result<ZeroExData, Error> = dexSwapError
      ? { success: false, error: dexSwapError }
      : { success: true, data: dexSwapOption }
    setResult(result)
    setIsFetching(false)
  }

  return {
    bestOptionResult: result,
    isFetchingTradeData: isFetching,
    fetchAndCompareOptions,
    isZeroExEI,
    isLeveragedEI,
  }
}
