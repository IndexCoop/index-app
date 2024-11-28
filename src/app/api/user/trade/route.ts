import { NextRequest, NextResponse } from 'next/server'

import { PostApiV2TradeMutationRequest } from '@/gen'
import { postApiV2Trade } from '@/gen/clients/axios/userService/postApiV2Trade'

export async function POST(req: NextRequest) {
  const trade: PostApiV2TradeMutationRequest = await req.json()

  if (!trade) {
    return NextResponse.json(
      { error: 'Bad Request: Missing Parameters.' },
      { status: 400 },
    )
  }

  const res = await postApiV2Trade(trade)

  return NextResponse.json(
    { success: res.data.status === 'ok' },
    { status: res.status },
  )
}
