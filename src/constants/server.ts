export const AlchemyMainnetUrl = `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_ID}`
export const AlchemyPolygonUrl = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_ID}`
export const IndexApiBaseUrl = 'https://api.indexcoop.com'

export function getApiKey(): string {
  return process.env.REACT_APP_INDEX_COOP_API ?? ''
}

export function getIndexApiHeaders() {
  const key = getApiKey()
  return {
    'X-INDEXCOOP-API-KEY': key,
  }
}
