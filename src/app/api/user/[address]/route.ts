import { NextResponse } from 'next/server'

import { postApiV2UserAddress } from '@/gen'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params

  const { data: user, status } = await postApiV2UserAddress({ address }, {})

  return NextResponse.json(user, { status })
}
