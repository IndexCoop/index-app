'use server'

import {
  getApiV2DataMarkets,
  GetApiV2DataMarkets200,
  GetApiV2DataMarketsQueryParamsCurrencyEnum,
} from '@/gen'

type MarketsResult =
  | { data: GetApiV2DataMarkets200; error?: undefined }
  | { data?: undefined; error: string }

export async function getMarkets(
  symbol: string,
  currency: string,
): Promise<MarketsResult> {
  if (!symbol || !currency) {
    return { error: 'Bad Request' }
  }

  try {
    const { data: market } = await getApiV2DataMarkets({
      symbol,
      currency:
        currency.toLowerCase() as GetApiV2DataMarketsQueryParamsCurrencyEnum,
    })

    return { data: market }
  } catch (error) {
    console.error('Error fetching market stats:', error)
    return { error: 'Internal server error' }
  }
}
