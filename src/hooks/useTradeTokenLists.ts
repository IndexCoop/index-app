import { useEffect, useState } from 'react'

import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import {
  ETH,
  indexNamesMainnet,
  indexNamesOptimism,
  indexNamesPolygon,
  Token,
} from 'constants/tokens'
import { fetchCoingeckoTokenPrice } from 'utils/coingeckoApi'
import {
  getAddressForToken,
  getCurrencyTokens,
  getNativeToken,
} from 'utils/tokens'

import { useIsSupportedNetwork } from './useIsSupportedNetwork'

export const useTradeTokenLists = (
  chainId: number | undefined,
  singleToken?: Token
) => {
  const supportedNetwork = useIsSupportedNetwork(chainId)
  const nativeToken = getNativeToken(chainId) ?? ETH
  const tokenList = getTokenListByChain(chainId, singleToken)

  const [isBuying, setIsBuying] = useState<boolean>(true)
  const [buyToken, setBuyToken] = useState<Token>(tokenList[0])
  const [buyTokenList, setBuyTokenList] = useState<Token[]>(tokenList)
  const [buyTokenPrice, setBuyTokenPrice] = useState<number>(0)
  const [nativeTokenPrice, setNativeTokenPrice] = useState<number>(0)
  const [sellToken, setSellToken] = useState<Token>(nativeToken)
  const [sellTokenList, setSellTokenList] = useState<Token[]>(
    getCurrencyTokens(chainId)
  )
  const [sellTokenPrice, setSellTokenPrice] = useState<number>(0)

  /**
   * Switches sell token lists between mainnet and polygon
   */
  useEffect(() => {
    if (chainId === undefined || !supportedNetwork) return
    const newSellTokenList = getCurrencyTokens(chainId)
    const newBuyTokenList = getTokenListByChain(chainId, singleToken)
    setSellTokenList(newSellTokenList)
    setBuyTokenList(newBuyTokenList)
    setSellToken(newSellTokenList[0])
    setBuyToken(newBuyTokenList[0])
    setIsBuying(true)
  }, [chainId])

  useEffect(() => {
    if (chainId === undefined || !supportedNetwork) return
    const fetchBuyTokenPrice = async () => {
      const buyTokenPrice = await getTokenPrice(buyToken, chainId)
      const nativeTokenPrice = await getTokenPrice(nativeToken, chainId)
      setBuyTokenPrice(buyTokenPrice)
      setNativeTokenPrice(nativeTokenPrice)
    }

    fetchBuyTokenPrice()
  }, [buyToken, chainId])

  useEffect(() => {
    if (chainId === undefined || !supportedNetwork) return
    const fetchSellTokenPrice = async () => {
      const sellTokenPrice = await getTokenPrice(sellToken, chainId)
      const nativeTokenPrice = await getTokenPrice(nativeToken, chainId)
      setSellTokenPrice(sellTokenPrice)
      setNativeTokenPrice(nativeTokenPrice)
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
    const currencyTokensList = getCurrencyTokens(chainId)
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
    nativeTokenPrice,
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
const getTokenListByChain = (
  chainId: number | undefined = MAINNET.chainId,
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
  chainId: number | undefined
): Promise<number> => {
  const tokenAddress = getAddressForToken(token, chainId)
  if (!tokenAddress || !chainId) return 0
  const tokenPrice = await fetchCoingeckoTokenPrice(tokenAddress, chainId)
  return tokenPrice
}
