import { NextRequest } from 'next/server'

import {
  postApiV2Trade,
  PostApiV2TradeMutation,
  PostApiV2TradeMutationRequest,
} from '@/gen'

export async function POST(req: NextRequest) {
  const trade: PostApiV2TradeMutationRequest = await req.json()

  if (!trade) {
    return new Response(
      JSON.stringify({ error: 'Bad Request: Missing Parameters.' }),
      { status: 400 },
    )
  }

  try {
    const res = await postApiV2Trade(trade)

    return new Response(JSON.stringify(res.data), { status: res.status })
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: (e as PostApiV2TradeMutation['Errors']).message,
      }),
      { status: 500 },
    )
  }
}
