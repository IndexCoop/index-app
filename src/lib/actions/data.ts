'use server'

import {
  getApiV2DataAddress,
  GetApiV2DataAddress200,
  GetApiV2DataAddressQueryParamsIntervalEnum,
  GetApiV2DataAddressQueryParamsMetricsEnum,
  GetApiV2DataAddressQueryParamsPeriodEnum,
} from '@/gen'

type DataResult =
  | { data: GetApiV2DataAddress200; error?: undefined }
  | { data?: undefined; error: string }

export async function getTokenData(
  tokenAddress: string,
  options: {
    chainId: number
    period?: GetApiV2DataAddressQueryParamsPeriodEnum
    interval?: GetApiV2DataAddressQueryParamsIntervalEnum
    metrics?: GetApiV2DataAddressQueryParamsMetricsEnum[]
  },
): Promise<DataResult> {
  try {
    const { data } = await getApiV2DataAddress(
      { address: tokenAddress },
      {
        chainId: options.chainId.toString(),
        period: options.period ?? 'latest',
        interval: options.interval ?? 'latest',
        metrics: options.metrics ?? [],
      },
    )

    return { data }
  } catch (error) {
    console.error('Error fetching token data:', error)
    return { error: 'Internal server error' }
  }
}
