'use client'

import { isAddress } from 'viem'

import { GetApiV2QuoteSlippageChainidAddress200 } from '@/gen'

type SlippageResult = {
  data: GetApiV2QuoteSlippageChainidAddress200 | null
  status: number
  error?: string
}

export async function getSlippage(
  chainId: string,
  address: string,
): Promise<SlippageResult> {
  if (!address || !isAddress(address)) {
    return { data: null, status: 400, error: 'Bad Request' }
  }

  const params = new URLSearchParams({ chainId, address })
  const res = await fetch(`/api/slippage?${params}`)
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
