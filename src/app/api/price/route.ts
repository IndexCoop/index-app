import { NextRequest, NextResponse } from 'next/server'

import { getApiV2PriceCoingeckoSimplePrice } from '@/gen'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.get('ids')
  const vs_currencies = searchParams.get('vs_currencies')

  if (!ids || !vs_currencies) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }

  try {
    const res = await getApiV2PriceCoingeckoSimplePrice({
      ids,
      vs_currencies,
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
