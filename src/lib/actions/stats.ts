'use server'

import {
  getApiV2ProductsStatsChainidAddress,
  GetApiV2ProductsStatsChainidAddress200,
  GetApiV2ProductsStatsChainidAddressPathParamsChainIdEnum,
  GetApiV2ProductsStatsChainidAddressQueryParamsBaseCurrencyEnum,
} from '@/gen'

type StatsResult =
  | { data: GetApiV2ProductsStatsChainidAddress200; error?: undefined }
  | { data?: undefined; error: string }

export async function getProductStats(
  chainId: string,
  address: string,
  base: string,
  baseCurrency: string,
): Promise<StatsResult> {
  if (!chainId || !address || !base || !baseCurrency) {
    return { error: 'Bad Request' }
  }

  try {
    const { data: stats } = await getApiV2ProductsStatsChainidAddress(
      {
        chainId:
          chainId as GetApiV2ProductsStatsChainidAddressPathParamsChainIdEnum,
        address,
      },
      {
        base,
        baseCurrency:
          baseCurrency as GetApiV2ProductsStatsChainidAddressQueryParamsBaseCurrencyEnum,
      },
    )

    return { data: stats }
  } catch (error) {
    console.error('Error fetching product stats:', error)
    return { error: 'Internal server error' }
  }
}
