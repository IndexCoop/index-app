import { NextRequest, NextResponse } from 'next/server'

import { getApiV2PriceCoingeckoSimpleTokenPrice } from '@/gen'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const res = await getApiV2PriceCoingeckoSimpleTokenPrice({
      chainId: Number(searchParams.get('chainId') ?? 1),
      contract_addresses: searchParams.get('contract_addresses') ?? '',
      vs_currencies: searchParams.get('vs_currencies') ?? '',
    })

    return NextResponse.json({
      ...res.data,
    })
  } catch (error) {
    console.error('Error fetching coingecko simple token price:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
