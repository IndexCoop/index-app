import { type NextRequest, NextResponse } from 'next/server'

import { getApiV2DataAddress, type GetApiV2DataAddressQueryParams } from '@/gen'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  try {
    const { searchParams } = new URL(req.url)
    const { address } = await params

    const queryParams: GetApiV2DataAddressQueryParams = {
      chainId: searchParams.get('chainId') ?? '',
      metrics: searchParams.getAll(
        'metrics',
      ) as GetApiV2DataAddressQueryParams['metrics'],
      period: searchParams.get(
        'period',
      ) as GetApiV2DataAddressQueryParams['period'],
      interval: searchParams.get(
        'interval',
      ) as GetApiV2DataAddressQueryParams['interval'],
    }

    const res = await getApiV2DataAddress({ address }, queryParams)
    return NextResponse.json(res.data, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
