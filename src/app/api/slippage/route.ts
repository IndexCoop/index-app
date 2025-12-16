import { NextRequest, NextResponse } from 'next/server'
import { isAddress } from 'viem'

import { getApiV2QuoteSlippageChainidAddress } from '@/gen'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const chainId = searchParams.get('chainId')
  const address = searchParams.get('address')

  if (!chainId || !address || !isAddress(address)) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }

  try {
    const { data, status } = await getApiV2QuoteSlippageChainidAddress({
      chainId,
      address,
    })

    return NextResponse.json(data, { status })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
