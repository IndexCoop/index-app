import { useEffect, useState } from 'react'

import { ethers } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import { ETH, Token } from 'constants/tokens'
import { useExchangeIssuanceLeveraged } from 'hooks/useExchangeIssuanceLeveraged'
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

  console.log('inside useBestTradeOption')
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

    /* Check ExchangeIssuanceLeveraged option */
    // If the user is issuing a token, then it compares the amount based on the buy amount from the dex swap option, otherwise will redeem all the sell amount
    const tokenAmount = isIssuance ? dexSwapOption.buyAmount : sellTokenAmount
    const isSellingETH = sellToken.symbol === ETH.symbol
    const isBuyingETH = buyToken.symbol === ETH.symbol
    let exchangeIssueLeveragedOption = undefined
    // TODO: These are not correct, need to understand how exchange issuance works here
    if (isSellingETH && isIssuance)
      exchangeIssueLeveragedOption = await issueExactSetFromETH(
        library,
        getChainAddress(buyToken, chainId) || '',
        BigNumber.from(buyTokenAmount),
        'uniswap-v3', //wrong?
        buyToken, //wrong
        buyTokenAmount // wrong
      )
    else if (!isSellingETH && isIssuance)
      exchangeIssueLeveragedOption = await issueExactSetFromERC20(
        library,
        getChainAddress(buyToken, chainId) || '',
        BigNumber.from(buyTokenAmount),
        getChainAddress(sellToken, chainId) || '',
        BigNumber.from(sellTokenAmount),
        'uniswap-v3', //wrong?
        sellToken, //wrong
        buyToken //wrong
      )
    else if (isBuyingETH && !isIssuance)
      exchangeIssueLeveragedOption = await redeemExactSetForETH(
        library,
        BigNumber.from(sellTokenAmount),
        BigNumber.from(buyTokenAmount),
        'uniswap-v3', //wrong?
        sellToken, //wrong
        buyToken //wrong
      )
    else if (!isBuyingETH && !isIssuance)
      exchangeIssueLeveragedOption = await redeemExactSetForERC20(
        library,
        getChainAddress(sellToken, chainId) || '',
        BigNumber.from(sellTokenAmount),
        getChainAddress(buyToken, chainId) || '',
        BigNumber.from(buyTokenAmount),
        'uniswap-v3', //wrong?
        'sellToken', //wrong
        'buyToken' //wrong
      )

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
