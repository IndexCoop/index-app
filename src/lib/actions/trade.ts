'use client'

import {
  PostApiV2TradeMutationRequest,
  PostApiV2TradeMutationResponse,
} from '@/gen'

type SaveTradeResult = {
  data: PostApiV2TradeMutationResponse | null
  status: number
  error?: string
}

export async function saveTrade(
  trade: PostApiV2TradeMutationRequest,
): Promise<SaveTradeResult> {
  if (!trade) {
    return {
      data: null,
      status: 400,
      error: 'Bad Request: Missing Parameters.',
    }
  }

  const res = await fetch('/api/trade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trade),
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
