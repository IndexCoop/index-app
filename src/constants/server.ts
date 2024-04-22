export const AlchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID!
export const AlchemyMainnetUrl = `https://eth-mainnet.alchemyapi.io/v2/${AlchemyApiKey}`

export const IndexApiBaseUrl = 'https://api.indexcoop.com'
export const IndexApiKey = process.env.NEXT_PUBLIC_INDEX_COOP_API

export const ZeroExAffiliateAddress =
  '0x37e6365d4f6aE378467b0e24c9065Ce5f06D70bF'

export function getIndexApiHeaders() {
  return {
    'X-INDEXCOOP-API-KEY': IndexApiKey ?? '',
    'Content-Type': 'application/json',
  }
}
