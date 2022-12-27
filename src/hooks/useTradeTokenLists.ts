import { useEffect, useState } from 'react'

import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import {
  DAI,
  ETH,
  FIXED_DAI,
  FIXED_USDC,
  flashMintIndexesMainnetRedeem,
  flashMintIndexesPolygonRedeem,
  icETHIndex,
  indexNamesMainnet,
  indexNamesPolygon,
  STETH,
  Token,
  USDC,
} from 'constants/tokens'
import { fetchCoingeckoTokenPrice } from 'utils/api/coingeckoApi'
import {
  getAddressForToken,
  getCurrencyTokens,
  getNativeToken,
} from 'utils/tokens'

import { useNetwork } from './useNetwork'

export const useTradeTokenLists = (
  singleToken?: Token,
  isFlashMint: boolean = false
) => {
  const { chainId, isSupportedNetwork } = useNetwork()
  const nativeToken = getNativeToken(chainId) ?? ETH
  const tokenList = getTokenListByChain(chainId, isFlashMint, singleToken)

  const [isBuying, setIsBuying] = useState<boolean>(true)
  const [buyToken, setBuyToken] = useState<Token>(tokenList[0])
  const [buyTokenList, setBuyTokenList] = useState<Token[]>(tokenList)
  const [buyTokenPrice, setBuyTokenPrice] = useState<number>(0)
  const [nativeTokenPrice, setNativeTokenPrice] = useState<number>(0)
  const [sellToken, setSellToken] = useState<Token>(nativeToken)
  const [sellTokenList, setSellTokenList] = useState<Token[]>(
    getCurrencyTokensForToken(tokenList[0], chainId ?? 1)
  )
  const [sellTokenPrice, setSellTokenPrice] = useState<number>(0)

  /**
   * Switches sell token lists between mainnet and polygon
   */
  useEffect(() => {
    if (chainId === undefined || !isSupportedNetwork) return
    const newBuyTokenList = getTokenListByChain(
      chainId,
      isFlashMint,
      singleToken
    )
    const newSellTokenList = getCurrencyTokensForToken(
      singleToken ?? newBuyTokenList[0],
      chainId ?? 1
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
      const newSellTokenList = getCurrencyTokensForToken(
        singleToken ?? filteredList[0],
        chainId ?? 1
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
      const newBuyTokenList = getCurrencyTokensForToken(
        singleToken ?? filteredList[0],
        chainId ?? 1
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
    const currencyToken = isBuying ? buyToken : sellToken
    const currencyTokensList = getCurrencyTokensForToken(
      singleToken ?? currencyToken,
      chainId ?? 1
    )
    const sellTokenList = isBuyingNew
      ? currencyTokensList
      : getTokenListByChain(chainId, isFlashMint, singleToken)
    const buyTokenList = isBuyingNew
      ? getTokenListByChain(chainId, isFlashMint, singleToken)
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
 * Returns currency tokens based on individual tokens and their supported trade pairs.
 * @returns A (filtered) Token[] list.
 */
const getCurrencyTokensForToken = (token: Token, chainId: number) => {
  if (token.symbol === FIXED_DAI.symbol) return [DAI]
  if (token.symbol === FIXED_USDC.symbol) return [USDC]
  if (token.symbol === icETHIndex.symbol) return [ETH, STETH]
  const currencyTokens = getCurrencyTokens(chainId)
  return currencyTokens
}

/**
 * Get the list of currency tokens for the selected chain
 * @returns Token[] list of tokens
 */
export const getTokenListByChain = (
  chainId: number | undefined = MAINNET.chainId,
  isFlashMint: boolean,
  singleToken: Token | undefined
) => {
  if (singleToken) return [singleToken]
  if (chainId === POLYGON.chainId) {
    return isFlashMint ? flashMintIndexesPolygonRedeem : indexNamesPolygon
  }
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
  const tokenPrice = await fetchCoingeckoTokenPrice(tokenAddress, chainId)
  return tokenPrice
}
