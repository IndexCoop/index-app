import { getIndexTokenData } from '@indexcoop/tokenlists'

import {
  IndexDataMetric,
  IndexDataProvider,
} from '@/lib/utils/api/index-data-provider'

export class NavProvider {
  async getNavPrice(tokenSymbol: string, chainId = 1): Promise<number> {
    const token = getIndexTokenData(tokenSymbol, chainId)
    if (!token) throw new Error(`Index token not found: ${tokenSymbol}`)

    const indexDataProvider = new IndexDataProvider()
    const res = await indexDataProvider.getTokenMetrics({
      tokenAddress: token.address,
      chainId,
      metrics: [IndexDataMetric.Nav],
    })

    // TODO: Determine if this should be 0 or throw
    return res?.nav ?? 0
  }
}
