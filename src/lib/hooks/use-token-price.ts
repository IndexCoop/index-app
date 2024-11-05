import { getTokenByChainAndSymbol, isIndexToken } from '@indexcoop/tokenlists'
import { useEffect, useState } from 'react'

import { ETH, Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/use-network'
import { fetchCoingeckoTokenPrice } from '@/lib/utils/api/coingecko'
import { NavProvider } from '@/lib/utils/api/nav'
import { getNativeToken } from '@/lib/utils/tokens'

export function useNativeTokenPrice(chainId?: number): number {
  const [nativeToken, setNativeToken] = useState(ETH)
  const nativeTokenPrice = useTokenPrice(nativeToken)

  useEffect(() => {
    const nativeToken = getNativeToken(chainId)
    setNativeToken(nativeToken ?? ETH)
  }, [chainId])

  return nativeTokenPrice
}

/**
 * Returns price of given token.
 * @returns price of token in USD
 */
export const getTokenPrice = async (
  token: Token,
  chainId: number | undefined,
): Promise<number> => {
  const listedToken = getTokenByChainAndSymbol(chainId, token.symbol)
  if (!listedToken || !chainId) return 0
  if (isIndexToken(listedToken)) {
    const navProvider = new NavProvider()
    const price = await navProvider.getNavPrice(listedToken.symbol, chainId)
    return price
  }
  const tokenPrice = await fetchCoingeckoTokenPrice(
    listedToken.address,
    chainId,
  )
  // Token price can return undefined
  return tokenPrice ?? 0
}

export function useTokenPrice(token: Token): number {
  const { chainId, isSupportedNetwork } = useNetwork()
  const [tokenPrice, setTokenPrice] = useState<number>(0)

  useEffect(() => {
    if (chainId === undefined || !isSupportedNetwork) {
      setTokenPrice(0)
      return
    }
    const fetchTokenPrice = async () => {
      const tokenPrice = await getTokenPrice(token, chainId)
      setTokenPrice(tokenPrice)
    }
    fetchTokenPrice()
  }, [chainId, isSupportedNetwork, token])

  return tokenPrice
}
