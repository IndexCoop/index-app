import { NextRequest, NextResponse } from 'next/server'

import {
  postApiV2Trade,
  PostApiV2TradeMutation,
  PostApiV2TradeMutationRequest,
} from '@/gen'

export async function POST(req: NextRequest) {
  const trade: PostApiV2TradeMutationRequest = await req.json()

  if (!trade) {
    return NextResponse.json(
      { error: 'Bad Request: Missing Parameters.' },
      { status: 400 },
    )
  }

  try {
    const res = await postApiV2Trade(trade)

    return NextResponse.json(res.data, { status: res.status })
  } catch (e) {
    return NextResponse.json(
      { error: (e as PostApiV2TradeMutation['Errors']).message },
      { status: 500 },
    )
  }
}
