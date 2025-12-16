'use client'

import { GetApiV2QuoteQuery } from '@/gen'

interface IndexQuoteRequest {
  chainId: number
  account: string
  inputToken: string
  outputToken: string
  inputAmount: string
  slippage: number
}

type QuoteResult = {
  data: GetApiV2QuoteQuery['Response'] | null
  status: number
  error?: string
}

export async function getQuote(
  request: IndexQuoteRequest,
): Promise<QuoteResult> {
  const res = await fetch('/api/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  const data = await res.json()

  if (!res.ok) {
    return {
      data: null,
      status: res.status,
      error: data?.message ?? data?.error,
    }
  }

  return { data, status: res.status }
}
