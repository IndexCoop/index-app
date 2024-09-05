import { IndexApi } from '@/lib/utils/api/index-api'

import { ARBITRUM, BASE, OPTIMISM, POLYGON } from '../../../constants/chains'
import { ETH } from '../../../constants/tokens'

const baseURL = '/coingecko'
const indexApi = new IndexApi()

const getAssetPlatform = (chainId: number) => {
  switch (chainId) {
    case ARBITRUM.chainId:
      return 'arbitrum-one'
    case BASE.chainId:
      return 'base'
    case POLYGON.chainId:
      return 'polygon-pos'
    case OPTIMISM.chainId:
      return 'optimistic-ethereum'
    default:
      return 'ethereum'
  }
}

export const fetchCoingeckoTokenPrice = async (
  address: string,
  chainId: number,
  baseCurrency = 'usd',
): Promise<number> => {
  if (address.toLowerCase() === ETH.address!.toLowerCase()) {
    const priceUrl =
      baseURL + `/simple/price/?ids=ethereum&vs_currencies=${baseCurrency}`

    const data = await indexApi.get(priceUrl).catch(() => {
      return 0
    })

    if (data === 0 || !data['ethereum']) return 0

    return data['ethereum'][baseCurrency]
  }

  const getPriceUrl =
    baseURL +
    `/simple/token_price/${getAssetPlatform(
      chainId,
    )}/?contract_addresses=${address}&vs_currencies=${baseCurrency}`

  const data = await indexApi.get(getPriceUrl).catch(() => {
    return 0
  })

  if (data === 0 || !data[address.toLowerCase()]) return 0

  return data[address.toLowerCase()][baseCurrency]
}
