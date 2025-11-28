import { NextResponse } from 'next/server'

import { postApiV2UserAddress, PostApiV2UserAddressMutation } from '@/gen'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params
  const { searchParams } = new URL(request.url)
  const referredBy = searchParams.get('referred_by')

  try {
    const body = referredBy ? { referred_by: referredBy } : {}
    const { data: user, status } = await postApiV2UserAddress({ address }, body)

    return NextResponse.json(user, { status })
  } catch (e) {
    return NextResponse.json(
      { error: (e as PostApiV2UserAddressMutation['Errors']).message },
      { status: 500 },
    )
  }
}
