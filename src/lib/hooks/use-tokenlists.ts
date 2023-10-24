import { useEffect, useMemo, useState } from 'react'

import indicesTokenList from '@/constants/tokenlists'
import { ETH, Token } from '@/constants/tokens'
import { fetchCoingeckoTokenPrice } from '@/lib/utils/api/coingeckoApi'
import {
  getAddressForToken,
  getCurrencyTokensForIndex,
  getNativeToken,
} from '@/lib/utils/tokens'

import { useNetwork } from './useNetwork'

export function useTokenlists(
  inputToken: Token,
  outputToken: Token,
  isMinting: boolean
) {
  const { chainId, isSupportedNetwork } = useNetwork()

  const [inputTokenPrice, setInputTokenPrice] = useState<number>(0)
  const [nativeTokenPrice, setNativeTokenPrice] = useState<number>(0)
  const [outputTokenPrice, setOutputTokenPrice] = useState<number>(0)

  const indexToken = useMemo(
    () => (isMinting ? outputToken : inputToken),
    [isMinting, inputToken, outputToken]
  )
  const nativeToken = getNativeToken(chainId) ?? ETH
  const currenciesList = getCurrencyTokensForIndex(indexToken, 1, isMinting)
  const tokenList = indicesTokenList

  const inputTokensList = useMemo(
    () => (isMinting ? currenciesList : tokenList),
    [isMinting, currenciesList, tokenList]
  )

  const outputTokensList = useMemo(
    () => (isMinting ? tokenList : currenciesList),
    [isMinting, currenciesList, tokenList]
  )

  // TODO:
  // const toggleIsMinting = () => {
  //   // TODO: test
  //   setIsBuying(!isBuying)
  //   routeSwap(outputToken.symbol, inputToken.symbol)
  // }

  // TODO: move to separate hook?
  useEffect(() => {
    if (chainId === undefined || !isSupportedNetwork) return
    const fetchBuyTokenPrice = async () => {
      const outputTokenPrice = await getTokenPrice(outputToken, chainId)
      const nativeTokenPrice = await getTokenPrice(nativeToken, chainId)
      setOutputTokenPrice(outputTokenPrice)
      setNativeTokenPrice(nativeTokenPrice)
    }
    fetchBuyTokenPrice()
  }, [outputToken, chainId])

  useEffect(() => {
    if (chainId === undefined || !isSupportedNetwork) return
    const fetchSellTokenPrice = async () => {
      const inputTokenPrice = await getTokenPrice(inputToken, chainId)
      const nativeTokenPrice = await getTokenPrice(nativeToken, chainId)
      setInputTokenPrice(inputTokenPrice)
      setNativeTokenPrice(nativeTokenPrice)
    }
    fetchSellTokenPrice()
  }, [inputToken, chainId])

  return {
    inputTokensList,
    inputTokenPrice,
    nativeTokenPrice,
    outputTokensList,
    outputTokenPrice,
    // toggleIsMinting,
  }
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
  // Token price can return undefined
  return tokenPrice ?? 0
}
