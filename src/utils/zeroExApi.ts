import { ZeroExApi } from '@indexcoop/flash-mint-sdk'

import { getIndexApiHeaders, IndexApiBaseUrl } from 'constants/server'

const affilliateAddress = '0x37e6365d4f6aE378467b0e24c9065Ce5f06D70bF'

export function getConfiguredZeroExApi(swapPathOverride: string): ZeroExApi {
  const headers = getIndexApiHeaders()
  return new ZeroExApi(
    `${IndexApiBaseUrl}/0x`,
    affilliateAddress,
    headers,
    swapPathOverride
  )
}
