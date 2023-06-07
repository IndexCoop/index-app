import { ZeroExApi } from '@indexcoop/flash-mint-sdk'

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
    swapPathOverride
  )
}
