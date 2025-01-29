import { NextRequest, NextResponse } from 'next/server'

import { GetApiV2QuoteSwapQueryParams, getApiV2QuoteSwap } from '@/gen'

export async function POST(req: NextRequest) {
  try {
    const params: GetApiV2QuoteSwapQueryParams = await req.json()
    const quote = await getApiV2QuoteSwap(params, {})

    if (!quote) {
      return NextResponse.json(
        { message: 'No swap quote found.' },
        { status: 404 },
      )
    }

    return NextResponse.json(quote.data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
