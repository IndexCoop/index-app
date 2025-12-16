'use client'

import {
  GetApiV2LeverageRatios200,
  GetApiV2UserAddressPositions200,
} from '@/gen'

type LeverageRatiosResult = {
  data: GetApiV2LeverageRatios200 | null
  status: number
  error?: string
}

export async function getLeverageRatios(
  chainId: string,
  market: string,
): Promise<LeverageRatiosResult> {
  const params = new URLSearchParams({ chainId, market })
  const res = await fetch(`/api/leverage/ratios?${params}`)
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

export type LeveragePositions = {
  open: GetApiV2UserAddressPositions200
  history: GetApiV2UserAddressPositions200
  stats: { [key: string]: number }
}

type LeverageHistoryResult = {
  data: LeveragePositions | null
  status: number
  error?: string
}

export async function getLeverageHistory(
  user: string,
  chainId: number,
): Promise<LeverageHistoryResult> {
  const res = await fetch('/api/leverage/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, chainId }),
  })
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
