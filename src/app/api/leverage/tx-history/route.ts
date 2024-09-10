import { fetchTokenTransfers } from '@/lib/utils/api/alchemy'
import { NextRequest } from 'next/server'
import { Address } from 'viem'

type TokenTransferRequest = {
  user: Address
  tokens: string[]
  chainId: number
}

export async function POST(req: NextRequest) {
  try {
    const { user, tokens, chainId } = (await req.json()) as TokenTransferRequest

    const transfers = await fetchTokenTransfers(user, tokens, chainId)

    return Response.json(transfers, { status: 200 })
  } catch (error) {
    return Response.json(error, { status: 500 })
  }
}
