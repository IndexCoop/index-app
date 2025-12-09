'use server'

import { isAddress } from 'viem'

import {
  getApiV2QuoteSlippageChainidAddress,
  GetApiV2QuoteSlippageChainidAddress200,
} from '@/gen'

type SlippageResult =
  | { data: GetApiV2QuoteSlippageChainidAddress200; status: number }
  | { data: string | { message: string }; status: 400 | 500 }

export async function getSlippage(
  chainId: string,
  address: string,
): Promise<SlippageResult> {
  try {
    if (!address || !isAddress(address)) {
      return { data: 'Bad Request', status: 400 }
    }

    const { data, status } = await getApiV2QuoteSlippageChainidAddress({
      chainId,
      address,
    })

    return { data, status }
  } catch (error) {
    console.log(error)
    return { data: { message: 'Internal Server Error' }, status: 500 }
  }
}
