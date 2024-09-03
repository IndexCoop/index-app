import { ZeroExSwapQuoteProvider } from '@indexcoop/flash-mint-sdk'

import { ARBITRUM, BASE, OPTIMISM, POLYGON } from '@/constants/chains'
import {
  getIndexApiHeaders,
  IndexApiBaseUrl,
  ZeroExAffiliateAddress,
} from '@/constants/server'

export function getConfiguredZeroExSwapQuoteProvider(
  chainId: number,
): ZeroExSwapQuoteProvider {
  const networkKey = getNetworkKey(chainId)
  const swapPathOverride = `/${networkKey}/swap/v1/quote`
  const headers = getIndexApiHeaders()
  return new ZeroExSwapQuoteProvider(
    `${IndexApiBaseUrl}/0x`,
    ZeroExAffiliateAddress,
    headers,
    swapPathOverride,
  )
}

export function getNetworkKey(chainId: number): string {
  switch (chainId) {
    case ARBITRUM.chainId:
      return 'arbitrum'
    case BASE.chainId:
      return 'base'
    case POLYGON.chainId:
      return 'polygon'
    case OPTIMISM.chainId:
      return 'optimism'
    default:
      return 'mainnet'
  }
}
