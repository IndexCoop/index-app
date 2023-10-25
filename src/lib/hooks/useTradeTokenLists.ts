import { useEffect, useState } from 'react'

import { MAINNET, POLYGON } from '@/constants/chains'
import {
  flashMintIndexesMainnetRedeem,
  indexNamesMainnet,
} from '@/constants/tokenlists'
import { CoinDeskEthTrendIndex, ETH, Token } from '@/constants/tokens'
import { fetchCoingeckoTokenPrice } from '@/lib/utils/api/coingecko'
import { NavProvider } from '@/lib/utils/api/nav'
import {
  getAddressForToken,
  getCurrencyTokensForIndex,
  getNativeToken,
} from '@/lib/utils/tokens'

import { useNetwork } from './useNetwork'

export const useTradeTokenLists = (isFlashMint: boolean = false) => {
  const { chainId, isSupportedNetwork } = useNetwork()
  const nativeToken = getNativeToken(chainId) ?? ETH
  const tokenList = getTokenListByChain(chainId, isFlashMint)

  const [isBuying, setIsBuying] = useState<boolean>(true)
  const [buyToken, setBuyToken] = useState<Token>(tokenList[0])
  const [buyTokenList, setBuyTokenList] = useState<Token[]>(tokenList)
  const [buyTokenPrice, setBuyTokenPrice] = useState<number>(0)
  const [nativeTokenPrice, setNativeTokenPrice] = useState<number>(0)
  const [sellToken, setSellToken] = useState<Token>(nativeToken)
  const [sellTokenList, setSellTokenList] = useState<Token[]>(
    getCurrencyTokensForIndex(tokenList[0], chainId ?? 1, isBuying)
  )
  const [sellTokenPrice, setSellTokenPrice] = useState<number>(0)

  /**
   * Switches sell token lists between mainnet and polygon
   */
  useEffect(() => {
    if (chainId === undefined || !isSupportedNetwork) return
    const newBuyTokenList = getTokenListByChain(chainId, isFlashMint)
    const newSellTokenList = getCurrencyTokensForIndex(
      newBuyTokenList[0],
      chainId ?? 1,
      isBuying
    )
    setSellTokenList(newSellTokenList)
    setBuyTokenList(newBuyTokenList)
    setSellToken(newSellTokenList[0])
    setBuyToken(newBuyTokenList[0])
    setIsBuying(true)
  }, [chainId])

  useEffect(() => {
    if (chainId === undefined || !isSupportedNetwork) return
    const fetchBuyTokenPrice = async () => {
      const buyTokenPrice = await getTokenPrice(buyToken, chainId)
      const nativeTokenPrice = await getTokenPrice(nativeToken, chainId)
      setBuyTokenPrice(buyTokenPrice)
      setNativeTokenPrice(nativeTokenPrice)
    }

    fetchBuyTokenPrice()
  }, [buyToken, chainId])

  useEffect(() => {
    if (chainId === undefined || !isSupportedNetwork) return
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
    if (isBuying) {
      const newSellTokenList = getCurrencyTokensForIndex(
        filteredList[0],
        chainId ?? 1,
        isBuying
      )
      setSellTokenList(newSellTokenList)
      setSellToken(newSellTokenList[0])
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
    if (!isBuying) {
      const newBuyTokenList = getCurrencyTokensForIndex(
        filteredList[0],
        chainId ?? 1,
        isBuying
      )
      setBuyTokenList(newBuyTokenList)
      setBuyToken(newBuyTokenList[0])
    }
    setSellToken(filteredList[0])
  }

  const swapTokenLists = () => {
    const isBuyingNew = !isBuying
    const prevSellToken = sellToken
    const prevBuyToken = buyToken
    const indexToken = isBuying ? buyToken : sellToken
    const currencyTokensList = getCurrencyTokensForIndex(
      indexToken,
      chainId ?? 1,
      isBuyingNew
    )
    const sellTokenList = isBuyingNew
      ? currencyTokensList
      : getTokenListByChain(chainId, isFlashMint)
    const buyTokenList = isBuyingNew
      ? getTokenListByChain(chainId, isFlashMint)
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
export const getTokenListByChain = (
  chainId: number | undefined = MAINNET.chainId,
  isFlashMint: boolean
) => {
  return isFlashMint ? flashMintIndexesMainnetRedeem : indexNamesMainnet
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
  if (token.symbol === CoinDeskEthTrendIndex.symbol) {
    const navProvider = new NavProvider()
    const price = await navProvider.getNavPrice(token.symbol)
    return price
  }
  const tokenPrice = await fetchCoingeckoTokenPrice(tokenAddress, chainId)
  // Token price can return undefined
  return tokenPrice ?? 0
}
