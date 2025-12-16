import { NextRequest, NextResponse } from 'next/server'

import { postApiV2UserAddress } from '@/gen'

export async function POST(req: NextRequest) {
  const { address, referredBy } = await req.json()

  if (!address) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }

  try {
    const body = referredBy ? { referred_by: referredBy } : {}
    const { data: user, status } = await postApiV2UserAddress({ address }, body)

    return NextResponse.json(user, { status })
  } catch (e) {
    console.error('Error creating/getting user:', e)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
