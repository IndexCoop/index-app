import { NextRequest, NextResponse } from 'next/server'
import { Address } from 'viem'

import { fetchTokenTransfers } from '@/lib/utils/api/alchemy'

type TokenTransferRequest = {
  user: Address
  tokens: string[]
  chainId: number
}

export async function POST(req: NextRequest) {
  try {
    const { user, tokens, chainId } = (await req.json()) as TokenTransferRequest

    const transfers = await fetchTokenTransfers(user, tokens, chainId)

    return NextResponse.json(transfers, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
