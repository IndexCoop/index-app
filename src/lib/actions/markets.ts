'use client'

import { GetApiV2DataMarkets200 } from '@/gen'

type MarketsResult = {
  data: GetApiV2DataMarkets200 | null
  status: number
  error?: string
}

export async function getMarkets(
  symbol: string,
  currency: string,
): Promise<MarketsResult> {
  if (!symbol || !currency) {
    return { data: null, status: 400, error: 'Bad Request' }
  }

  const params = new URLSearchParams({ symbol, currency })
  const res = await fetch(`/api/markets?${params}`)
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
