import { NextResponse } from 'next/server'
import { isAddress } from 'viem'

import { getApiV2QuoteSlippageChainidAddress } from '@/gen'

import type { NextRequest } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string[] } },
): Promise<Response> {
  try {
    const {
      slug: [chainId, address],
    } = params

    if (!address || !isAddress(address)) {
      return NextResponse.json('Bad Request', { status: 400 })
    }

    const { data, status } = await getApiV2QuoteSlippageChainidAddress({
      chainId,
      address,
    })

    return NextResponse.json(data, { status })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
