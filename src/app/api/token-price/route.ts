import { NextRequest, NextResponse } from 'next/server'

import { getApiV2PriceCoingeckoSimpleTokenPrice } from '@/gen'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const chainId = searchParams.get('chainId')
  const contract_addresses = searchParams.get('contract_addresses')
  const vs_currencies = searchParams.get('vs_currencies')

  if (!chainId || !contract_addresses || !vs_currencies) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }

  try {
    const res = await getApiV2PriceCoingeckoSimpleTokenPrice({
      chainId: Number(chainId),
      contract_addresses,
      vs_currencies,
    })

    return NextResponse.json(res.data)
  } catch (error) {
    console.error('Error fetching coingecko token price:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
