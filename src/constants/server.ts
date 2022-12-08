export const AlchemyApiKey = process.env.REACT_APP_ALCHEMY_ID
export const AlchemyMainnetUrl = `https://eth-mainnet.alchemyapi.io/v2/${AlchemyApiKey}`
export const AlchemyPolygonUrl = `https://polygon-mainnet.g.alchemy.com/v2/${AlchemyApiKey}`

export const IndexApiBaseUrl = 'https://api.indexcoop.com'
export const IndexApiKey = process.env.REACT_APP_INDEX_COOP_API

export function getIndexApiHeaders() {
  return {
    'X-INDEXCOOP-API-KEY': IndexApiKey ?? '',
  }
}
