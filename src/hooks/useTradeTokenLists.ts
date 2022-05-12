import { useEffect, useState } from 'react'

import { ChainId } from '@usedapp/core'

import { OPTIMISM, POLYGON } from 'constants/chains'
import {
  DefiPulseIndex,
  ETH,
  indexNamesMainnet,
  indexNamesOptimism,
  indexNamesPolygon,
  mainnetCurrencyTokens,
  polygonCurrencyTokens,
  Token,
} from 'constants/tokens'
import { fetchCoingeckoTokenPrice } from 'utils/coingeckoApi'
import { getAddressForToken, getNativeToken } from 'utils/tokens'

export const useTradeTokenLists = (
  chainId: ChainId | undefined,
  singleToken?: Token
) => {
  const nativeToken = getNativeToken(chainId) ?? ETH
  const tokenList = getTokenListByChain(chainId, singleToken)

  const [isBuying, setIsBuying] = useState<boolean>(true)
  const [buyToken, setBuyToken] = useState<Token>(tokenList[0])
  const [buyTokenList, setBuyTokenList] = useState<Token[]>(tokenList)
  const [buyTokenPrice, setBuyTokenPrice] = useState<number>(0)
  const [sellToken, setSellToken] = useState<Token>(nativeToken)
  const [sellTokenList, setSellTokenList] = useState<Token[]>(
    getCurrencyTokensByChain(chainId)
  )
  const [sellTokenPrice, setSellTokenPrice] = useState<number>(0)

  /**
   * Switches sell token lists between mainnet and polygon
   */
  useEffect(() => {
    const newSellTokenList = getCurrencyTokensByChain(chainId)
    const newBuyTokenList = getTokenListByChain(chainId, singleToken)
    setSellTokenList(newSellTokenList)
    setBuyTokenList(newBuyTokenList)
    setSellToken(newSellTokenList[0])
    setBuyToken(newBuyTokenList[0])
    setIsBuying(true)
  }, [chainId])

  useEffect(() => {
    const fetchBuyTokenPrice = async () => {
      const buyTokenPrice = await getTokenPrice(buyToken, chainId)
      setBuyTokenPrice(buyTokenPrice)
    }

    fetchBuyTokenPrice()
  }, [buyToken, chainId])

  useEffect(() => {
    const fetchSellTokenPrice = async () => {
      const sellTokenPrice = await getTokenPrice(sellToken, chainId)
      setSellTokenPrice(sellTokenPrice)
    }

    fetchSellTokenPrice()
  }, [sellToken, chainId])

  const changeBuyToken = (symbol: string) => {
    const filteredList = buyTokenList.filter((token) => token.symbol === symbol)
    if (filteredList.length < 0) {
      return
    }
    setBuyToken(filteredList[0])
  }

  const changeSellToken = (symbol: string) => {
    const filteredList = sellTokenList.filter(
      (token) => token.symbol === symbol
    )
    if (filteredList.length < 0) {
      return
    }
    setSellToken(filteredList[0])
  }

  const swapTokenLists = () => {
    const isBuyingNew = !isBuying
    const prevSellToken = sellToken
    const prevBuyToken = buyToken
    const currencyTokensList = getCurrencyTokensByChain(chainId)
    const sellTokenList = isBuyingNew
      ? currencyTokensList
      : getTokenListByChain(chainId, singleToken)
    const buyTokenList = isBuyingNew
      ? getTokenListByChain(chainId, singleToken)
      : currencyTokensList
    setSellTokenList(sellTokenList)
    setBuyTokenList(buyTokenList)
    setSellToken(prevBuyToken)
    setBuyToken(prevSellToken)
    setIsBuying(isBuyingNew)
  }

  return {
    isBuying,
    buyToken,
    buyTokenList,
    buyTokenPrice,
    sellToken,
    sellTokenList,
    sellTokenPrice,
    changeBuyToken,
    changeSellToken,
    swapTokenLists,
  }
}

/**
 * Get the list of currency tokens for the selected chain
 * @returns Token[] list of tokens
 */
const getCurrencyTokensByChain = (
  chainId: ChainId | undefined = ChainId.Mainnet
) => {
  if (chainId === ChainId.Polygon) return polygonCurrencyTokens
  return mainnetCurrencyTokens
}

/**
 * Get the list of currency tokens for the selected chain
 * @returns Token[] list of tokens
 */
const getTokenListByChain = (
  chainId: ChainId | undefined = ChainId.Mainnet,
  singleToken: Token | undefined
) => {
  if (singleToken) return [singleToken]
  if (chainId === POLYGON.chainId) return indexNamesPolygon
  if (chainId === OPTIMISM.chainId) return indexNamesOptimism
  return indexNamesMainnet
}

/**
 * Returns price of given token.
 * @returns price of token in USD
 */
const getTokenPrice = async (
  token: Token,
  chainId: ChainId | undefined
): Promise<number> => {
  const tokenAddress = getAddressForToken(token, chainId)
  if (!tokenAddress || !chainId) return 0
  const tokenPrice = await fetchCoingeckoTokenPrice(tokenAddress, chainId)
  return tokenPrice
}
