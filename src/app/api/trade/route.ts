import { NextRequest, NextResponse } from 'next/server'

import { postApiV2Trade, PostApiV2TradeMutationRequest } from '@/gen'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as PostApiV2TradeMutationRequest

  if (!body) {
    return NextResponse.json(
      { error: 'Bad Request: Missing Parameters.' },
      { status: 400 },
    )
  }

  try {
    const res = await postApiV2Trade(body)
    return NextResponse.json(res.data, { status: res.status })
  } catch (e) {
    console.error('Error saving trade:', e)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
