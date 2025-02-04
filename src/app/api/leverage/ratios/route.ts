import { NextRequest, NextResponse } from 'next/server'

import {
  getApiV2LeverageRatios,
  GetApiV2LeverageRatiosQueryParamsChainIdEnum,
  GetApiV2LeverageRatiosQueryParamsMarketEnum,
} from '@/gen'

export async function GET(req: NextRequest) {
  try {
    const chainId = req.nextUrl.searchParams.get('chainId') as string
    const market = req.nextUrl.searchParams.get('market') as string
    const res = await getApiV2LeverageRatios({
      chainId:
        chainId?.toString() as GetApiV2LeverageRatiosQueryParamsChainIdEnum,
      market: market as GetApiV2LeverageRatiosQueryParamsMarketEnum,
    })
    return NextResponse.json(res.data)
  } catch (e) {
    console.error('Caught leverage ratios error', e)
    return NextResponse.json([])
  }
}
