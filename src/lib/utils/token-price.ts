import { getChainTokenList } from '@indexcoop/tokenlists'

import { PolygonLegacyTokenList } from '@/app/legacy/config'
import { getAddressForToken } from '@/lib/utils/tokens'

import { fetchCoingeckoTokenPrice } from './api/coingecko'
import { fetchTokenNAV } from './api/index-data-provider'

import type { Token } from '@/constants/tokens'
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
    // Force using Coingecko for these deprecated indices
    isIndexToken = false
  }
  if (isIndexToken) {
    const dataResponse = await fetchTokenNAV({
      chainId,
      tokenAddress,
    })
    return dataResponse ?? 0
  }
  const tokenPrice = await fetchCoingeckoTokenPrice(tokenAddress, chainId)
  // Token price can return undefined
  return tokenPrice ?? 0
}
