'use client'

import {
  GetApiV2DataAddress200,
  GetApiV2DataAddressQueryParamsIntervalEnum,
  GetApiV2DataAddressQueryParamsMetricsEnum,
  GetApiV2DataAddressQueryParamsPeriodEnum,
} from '@/gen'

type DataResult = {
  data: GetApiV2DataAddress200 | null
  status: number
  error?: string
}

export async function getTokenData(
  tokenAddress: string,
  options: {
    chainId: number
    period?: GetApiV2DataAddressQueryParamsPeriodEnum
    interval?: GetApiV2DataAddressQueryParamsIntervalEnum
    metrics?: GetApiV2DataAddressQueryParamsMetricsEnum[]
  },
): Promise<DataResult> {
  const params = new URLSearchParams({
    address: tokenAddress,
    chainId: options.chainId.toString(),
  })

  if (options.period) params.append('period', options.period)
  if (options.interval) params.append('interval', options.interval)
  if (options.metrics) {
    options.metrics.forEach((m) => params.append('metrics', m))
  }

  const res = await fetch(`/api/data?${params}`)
  const data = await res.json()

  if (!res.ok) {
    return {
      data: null,
      status: res.status,
      error: data?.error ?? data?.message,
    }
  }

  return { data, status: res.status }
}
