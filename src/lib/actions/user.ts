'use client'

import { PostApiV2UserAddress200 } from '@/gen'

type UserResult = {
  data: PostApiV2UserAddress200 | null
  status: number
  error?: string
}

export async function getOrCreateUser(
  address: string,
  referredBy?: string | null,
): Promise<UserResult> {
  const res = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, referredBy }),
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
