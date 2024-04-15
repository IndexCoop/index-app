import { indicesTokenList } from '@/constants/tokenlists'
import { IndexApi } from '@/lib/utils/api/index-api'

import { OPTIMISM, POLYGON } from '../../../constants/chains'
import { ETH } from '../../../constants/tokens'

const baseURL = '/coingecko'
const indexApi = new IndexApi()

const getAssetPlatform = (chainId: number) => {
  if (chainId === POLYGON.chainId) return 'polygon-pos'
  if (chainId === OPTIMISM.chainId) return 'optimistic-ethereum'
  return 'ethereum'
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

type CoingeckoMarketData = {
  current_price: { usd: number }
  market_cap: { usd: number }
  price_change_percentage_24h_in_currency: { usd: number }
}

export const fetchCoingeckoMarketData = async (
  address: string,
): Promise<CoingeckoMarketData | null> => {
  const token = indicesTokenList.find(
    (token) => token.address?.toLowerCase() === address.toLowerCase(),
  )
  const url = `${baseURL}/coins/${token?.coingeckoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  const { market_data } = await indexApi.get(url)
  return market_data
}
