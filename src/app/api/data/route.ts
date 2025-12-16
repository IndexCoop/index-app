import { NextRequest, NextResponse } from 'next/server'

import {
  getApiV2DataAddress,
  GetApiV2DataAddressQueryParamsIntervalEnum,
  GetApiV2DataAddressQueryParamsMetricsEnum,
  GetApiV2DataAddressQueryParamsPeriodEnum,
} from '@/gen'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')
  const chainId = searchParams.get('chainId')
  const period = searchParams.get('period') as
    | GetApiV2DataAddressQueryParamsPeriodEnum
    | undefined
  const interval = searchParams.get('interval') as
    | GetApiV2DataAddressQueryParamsIntervalEnum
    | undefined
  const metrics = searchParams.getAll('metrics') as
    | GetApiV2DataAddressQueryParamsMetricsEnum[]
    | undefined

  if (!address || !chainId) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }

  try {
    const { data } = await getApiV2DataAddress(
      { address },
      {
        chainId,
        period: period ?? 'latest',
        interval: interval ?? 'latest',
        metrics: metrics ?? [],
      },
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching token data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
