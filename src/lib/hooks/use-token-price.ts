import { useEffect, useState } from 'react'

import { ETH, Token } from '@/constants/tokens'
import { fetchCoingeckoTokenPrice } from '@/lib/utils/api/coingecko'
import { getAddressForToken, getNativeToken } from '@/lib/utils/tokens'

import { useNetwork } from './useNetwork'

export function useNativeTokenPrice(chainId?: number): number {
  const [nativeToken, setNativeToken] = useState(ETH)
  const nativeTokenPrice = useTokenPrice(nativeToken)

  useEffect(() => {
    const nativeToken = getNativeToken(chainId)
    setNativeToken(nativeToken ?? ETH)
  }, [chainId])

  return nativeTokenPrice
}

export function useTokenPrice(token: Token): number {
  const { chainId, isSupportedNetwork } = useNetwork()
  const [tokenPrice, setTokenPrice] = useState<number>(0)

  useEffect(() => {
    if (chainId === undefined || !isSupportedNetwork) return
    const fetchTokenPrice = async () => {
      const tokenPrice = await getTokenPrice(token, chainId)
      setTokenPrice(tokenPrice)
    }
    fetchTokenPrice()
  }, [chainId, isSupportedNetwork, token])

  return tokenPrice
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
