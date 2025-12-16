'use client'

import { GetApiV2ProductsStatsChainidAddress200 } from '@/gen'

type StatsResult = {
  data: GetApiV2ProductsStatsChainidAddress200 | null
  status: number
  error?: string
}

export async function getProductStats(
  chainId: string,
  address: string,
  base: string,
  baseCurrency: string,
): Promise<StatsResult> {
  if (!chainId || !address || !base || !baseCurrency) {
    return { data: null, status: 400, error: 'Bad Request' }
  }

  const params = new URLSearchParams({ chainId, address, base, baseCurrency })
  const res = await fetch(`/api/stats?${params}`)
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
