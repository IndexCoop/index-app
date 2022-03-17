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
  Token,
} from 'constants/tokens'
import {
  Exchange,
  useExchangeIssuanceLeveraged,
} from 'hooks/useExchangeIssuanceLeveraged'
import { useExchangeIssuanceZeroEx } from 'hooks/useExchangeIssuanceZeroEx'
import { displayFromWei, getChainAddress } from 'utils'
import { getIssuanceModule } from 'utils/issuanceModule'
import { getQuote, getZeroExTradeData, ZeroExData } from 'utils/zeroExUtils'

export const useBestTradeOption = () => {
  const { getRequiredIssuanceComponents } = useExchangeIssuanceZeroEx()
  const {
    issueExactSetFromERC20,
    issueExactSetFromETH,
    redeemExactSetForERC20,
    redeemExactSetForETH,
  } = useExchangeIssuanceLeveraged()
  const { chainId, library } = useEthers()

  const [bestOption, setBestOption] = useState<ZeroExData | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)

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
    const dexSwapOption = await getZeroExTradeData(
      true,
      sellToken,
      buyToken,
      sellTokenAmount,
      chainId || 1
    )
    console.log('dexSwapOption', dexSwapOption)

    /* Check ExchangeIssuanceLeveraged option */
    // If the user is issuing a token, then it compares the amount based on the buy amount from the dex swap option, otherwise will redeem all the sell amount
    const tokenAmount = isIssuance ? dexSwapOption.buyAmount : sellTokenAmount
    const isSellingETH = sellToken.symbol === ETH.symbol
    const isBuyingETH = buyToken.symbol === ETH.symbol
    const isBuyingTokenEligible = isEligibleLeveragedToken(buyToken)
    const isSellingTokenEligible = isEligibleLeveragedToken(sellToken)
    let exchangeIssueLeveragedOption = undefined
    // TODO: These are not correct, need to understand how exchange issuance works here
    if (isSellingETH && isIssuance && isBuyingTokenEligible)
      exchangeIssueLeveragedOption = await issueExactSetFromETH(
        library,
        getChainAddress(buyToken, chainId) || '',
        BigNumber.from(buyTokenAmount),
        Exchange.UniV3,
        buyToken, //wrong
        buyTokenAmount // wrong
      )
    else if (!isSellingETH && isIssuance && isBuyingTokenEligible)
      exchangeIssueLeveragedOption = await issueExactSetFromERC20(
        library,
        getChainAddress(buyToken, chainId) || '',
        BigNumber.from(buyTokenAmount),
        getChainAddress(sellToken, chainId) || '',
        BigNumber.from(sellTokenAmount),
        Exchange.UniV3,
        sellToken, //wrong
        buyToken //wrong
      )
    else if (isBuyingETH && !isIssuance && isSellingTokenEligible)
      exchangeIssueLeveragedOption = await redeemExactSetForETH(
        library,
        BigNumber.from(sellTokenAmount),
        BigNumber.from(buyTokenAmount),
        Exchange.UniV3,
        sellToken, //wrong
        buyToken //wrong
      )
    else if (!isBuyingETH && !isIssuance && isSellingTokenEligible)
      exchangeIssueLeveragedOption = await redeemExactSetForERC20(
        library,
        getChainAddress(sellToken, chainId) || '',
        BigNumber.from(sellTokenAmount),
        getChainAddress(buyToken, chainId) || '',
        BigNumber.from(buyTokenAmount),
        Exchange.UniV3,
        'sellToken', //wrong
        'buyToken' //wrong
      )

    console.log('exchangeIssueLeveragedOption', exchangeIssueLeveragedOption)
    /* NOW COMPARE */
    // Checking via exchange issuance
    // const buyTokenAmount = option1Data.minOutput
    // const option2Data = await getTradeDataFromExchangeIssuance(buyTokenAmount)
    // TODO: compare and return best option
    setBestOption(dexSwapOption)
    setIsFetching(false)
  }

  return {
    bestOption,
    isFetchingTradeData: isFetching,
    fetchAndCompareOptions,
  }
}
