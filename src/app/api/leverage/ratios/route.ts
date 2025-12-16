import { NextRequest, NextResponse } from 'next/server'

import {
  getApiV2LeverageRatios,
  GetApiV2LeverageRatiosQueryParamsChainIdEnum,
  GetApiV2LeverageRatiosQueryParamsMarketEnum,
} from '@/gen'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const chainId = searchParams.get('chainId')
  const market = searchParams.get('market')

  if (!chainId || !market) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }

  try {
    const res = await getApiV2LeverageRatios({
      chainId: chainId as GetApiV2LeverageRatiosQueryParamsChainIdEnum,
      market: market as GetApiV2LeverageRatiosQueryParamsMarketEnum,
    })
    return NextResponse.json(res.data)
  } catch (e) {
    console.error('Caught leverage ratios error', e)
    return NextResponse.json([])
  }
}
