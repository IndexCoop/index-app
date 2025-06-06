import { NextRequest, NextResponse } from 'next/server'

import { getApiV2PrtsFeesAddress } from '@/gen'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params

  try {
    const { data: fees } = await getApiV2PrtsFeesAddress({
      address,
    })

    return NextResponse.json({
      ...fees,
    })
  } catch (error) {
    console.error('Error fetching PRT fees:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
