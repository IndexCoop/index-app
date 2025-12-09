'use server'

import {
  postApiV2Trade,
  PostApiV2TradeMutation,
  PostApiV2TradeMutationRequest,
  PostApiV2TradeMutationResponse,
} from '@/gen'

type SaveTradeResult = {
  data: PostApiV2TradeMutationResponse | null
  status: number
  error?: string
}

export async function saveTrade(
  trade: PostApiV2TradeMutationRequest,
): Promise<SaveTradeResult> {
  if (!trade) {
    return {
      data: null,
      status: 400,
      error: 'Bad Request: Missing Parameters.',
    }
  }

  try {
    const res = await postApiV2Trade(trade)
    return { data: res.data, status: res.status }
  } catch (e) {
    return {
      data: null,
      status: 500,
      error: (e as PostApiV2TradeMutation['Errors']).message,
    }
  }
}
