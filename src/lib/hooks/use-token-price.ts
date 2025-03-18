import { getChainTokenList } from '@indexcoop/tokenlists'
import { useEffect, useState } from 'react'
import { base } from 'viem/chains'

import { PolygonLegacyTokenList } from '@/app/legacy/config'
import { ETH, type Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/use-network'
import { fetchCoingeckoTokenPrice } from '@/lib/utils/api/coingecko'
import { fetchTokenMetrics } from '@/lib/utils/api/index-data-provider'
import { NavProvider } from '@/lib/utils/api/nav'
import { getAddressForToken, getNativeToken } from '@/lib/utils/tokens'

export function useNativeTokenPrice(chainId?: number): number {
  const [nativeToken, setNativeToken] = useState(ETH)
  const nativeTokenPrice = useTokenPrice(nativeToken)

  useEffect(() => {
    const nativeToken = getNativeToken(chainId)
    setNativeToken(nativeToken ?? ETH)
  }, [chainId])

  return nativeTokenPrice
}

function shouldOverrideNav(symbol: string, chainId?: number) {
  const navTokenOverrides = [
    'hyeth',
    'icusd',
    'eth2xbtc',
    'btc2xeth',
    'usol2x',
    'usui2x',
    'wsteth15x',
  ]
  if (navTokenOverrides.includes(symbol.toLowerCase())) return true
  if (
    chainId === base.id &&
    (symbol.toLowerCase() === 'btc2x' || symbol.toLowerCase() === 'btc3x')
  )
    return true
  return false
}

/**
 * Returns price of given token.
 * @returns price of token in USD
 */
export const getTokenPrice = async (
  token: Token,
  chainId: number | undefined,
): Promise<number> => {
  const tokenAddress = getAddressForToken(token.symbol, chainId)
  if (!tokenAddress || !chainId) return 0
  const productTokensList = getChainTokenList(chainId, ['product'])
  let isIndexToken = productTokensList.some(
    ({ address }) => address === tokenAddress,
  )
  if (
    token.symbol === 'DATA' ||
    token.symbol === 'GMI' ||
    PolygonLegacyTokenList.some(
      (polygonIndex) => token.symbol === polygonIndex.symbol,
    )
  ) {
    // Force using Coingecko for this deprecated indices
    isIndexToken = false
  }
  if (shouldOverrideNav(token.symbol, chainId)) {
    const dataResponse = await fetchTokenMetrics({
      chainId,
      tokenAddress,
      metrics: ['nav'],
    })
    return dataResponse?.NetAssetValue ?? 0
  }
  if (isIndexToken) {
    const navProvider = new NavProvider()
    const price = await navProvider.getNavPrice(token.symbol, chainId)
    return price
  }
  const tokenPrice = await fetchCoingeckoTokenPrice(tokenAddress, chainId)
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
