import { NextRequest, NextResponse } from 'next/server'

import { getApiV2PriceCoingeckoSimplePrice } from '@/gen'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const res = await getApiV2PriceCoingeckoSimplePrice({
      ids: searchParams.get('ids') ?? '',
      vs_currencies: searchParams.get('vs_currencies') ?? '',
    })

    return NextResponse.json(res.data)
  } catch (error) {
    console.error('Error fetching coingecko simple price:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
