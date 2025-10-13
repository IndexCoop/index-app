import { type NextRequest, NextResponse } from 'next/server'

import { getApiV2ProductsStatsChainidAddress } from '@/gen'

import type {
  GetApiV2ProductsStatsChainidAddressPathParamsChainIdEnum,
  GetApiV2ProductsStatsChainidAddressQueryParamsBaseCurrencyEnum,
} from '@/gen'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const chainId = searchParams.get('chainId')
  const address = searchParams.get('address')
  const base = searchParams.get('base')
  const baseCurrency = searchParams.get('baseCurrency')

  if (!chainId || !address || !base || !baseCurrency) {
    return NextResponse.json('Bad Request', { status: 400 })
  }

  try {
    const { data: stats } = await getApiV2ProductsStatsChainidAddress(
      {
        chainId:
          chainId as GetApiV2ProductsStatsChainidAddressPathParamsChainIdEnum,
        address,
      },
      {
        base,
        baseCurrency:
          baseCurrency as GetApiV2ProductsStatsChainidAddressQueryParamsBaseCurrencyEnum,
      },
    )

    return NextResponse.json({
      ...stats,
    })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
