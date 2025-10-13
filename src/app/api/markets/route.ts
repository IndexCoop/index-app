import { NextRequest, NextResponse } from 'next/server'

import { getApiV2DataMarkets } from '@/gen'

import type { GetApiV2DataMarketsQueryParamsCurrencyEnum } from '@/gen'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol')
  const currency = searchParams.get('currency')

  if (!symbol || !currency) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }

  try {
    const { data: market } = await getApiV2DataMarkets({
      symbol,
      currency:
        currency.toLowerCase() as GetApiV2DataMarketsQueryParamsCurrencyEnum,
    })

    return NextResponse.json({
      ...market,
    })
  } catch (error) {
    console.error('Error fetching market stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
