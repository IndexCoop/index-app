import { ZeroExApi } from '@indexcoop/flash-mint-sdk'

import { ARBITRUM, OPTIMISM, POLYGON } from '@/constants/chains'
import {
  getIndexApiHeaders,
  IndexApiBaseUrl,
  ZeroExAffiliateAddress,
} from '@/constants/server'

export function getConfiguredZeroExApi(swapPathOverride: string): ZeroExApi {
  const headers = getIndexApiHeaders()
  return new ZeroExApi(
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
    case POLYGON.chainId:
      return 'polygon'
    case OPTIMISM.chainId:
      return 'optimism'
    default:
      return 'mainnet'
  }
}
