'use client'

import {
  GetApiV2PriceCoingeckoSimplePrice200,
  GetApiV2PriceCoingeckoSimpleTokenPrice200,
} from '@/gen'

type SimplePriceResult = {
  data: GetApiV2PriceCoingeckoSimplePrice200 | null
  status: number
  error?: string
}

export async function getCoingeckoSimplePrice(
  ids: string,
  vs_currencies: string,
): Promise<SimplePriceResult> {
  const params = new URLSearchParams({ ids, vs_currencies })
  const res = await fetch(`/api/price?${params}`)
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

type TokenPriceResult = {
  data: GetApiV2PriceCoingeckoSimpleTokenPrice200 | null
  status: number
  error?: string
}

export async function getCoingeckoTokenPrice(
  chainId: number,
  contract_addresses: string,
  vs_currencies: string,
): Promise<TokenPriceResult> {
  const params = new URLSearchParams({
    chainId: chainId.toString(),
    contract_addresses,
    vs_currencies,
  })
  const res = await fetch(`/api/token-price?${params}`)
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
