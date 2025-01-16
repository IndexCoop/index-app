import { NextResponse } from 'next/server'

import { postApiV2UserAddress, PostApiV2UserAddressMutation } from '@/gen'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params

  try {
    const { data: user, status } = await postApiV2UserAddress({ address }, {})

    return NextResponse.json(user, { status })
  } catch (e) {
    return NextResponse.json(
      { error: (e as PostApiV2UserAddressMutation['Errors']).message },
      { status: 500 },
    )
  }
}
