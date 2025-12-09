'use server'

import {
  getApiV2PriceCoingeckoSimplePrice,
  getApiV2PriceCoingeckoSimpleTokenPrice,
  GetApiV2PriceCoingeckoSimplePrice200,
  GetApiV2PriceCoingeckoSimpleTokenPrice200,
} from '@/gen'

type SimplePriceResult =
  | { data: GetApiV2PriceCoingeckoSimplePrice200; error?: undefined }
  | { data?: undefined; error: string }

export async function getCoingeckoSimplePrice(
  ids: string,
  vs_currencies: string,
): Promise<SimplePriceResult> {
  try {
    const res = await getApiV2PriceCoingeckoSimplePrice({
      ids,
      vs_currencies,
    })

    return { data: res.data }
  } catch (error) {
    console.error('Error fetching coingecko simple price:', error)
    return { error: 'Internal server error' }
  }
}

type TokenPriceResult =
  | { data: GetApiV2PriceCoingeckoSimpleTokenPrice200; error?: undefined }
  | { data?: undefined; error: string }

export async function getCoingeckoTokenPrice(
  chainId: number,
  contract_addresses: string,
  vs_currencies: string,
): Promise<TokenPriceResult> {
  try {
    const res = await getApiV2PriceCoingeckoSimpleTokenPrice({
      chainId,
      contract_addresses,
      vs_currencies,
    })

    return { data: res.data }
  } catch (error) {
    console.error('Error fetching coingecko simple token price:', error)
    return { error: 'Internal server error' }
  }
}
