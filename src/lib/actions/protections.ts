'use client'

import { GetApiV2Protections200 } from '@/gen'

type ProtectionsResult = {
  data: GetApiV2Protections200 | null
  status: number
  error?: string
}

export async function getProtections(
  address?: string,
): Promise<ProtectionsResult> {
  const params = address ? `?address=${address}` : ''
  const res = await fetch(`/api/protections${params}`)
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
