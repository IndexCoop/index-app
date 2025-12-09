'use server'

import { EthAddress, type QuoteToken } from '@indexcoop/flash-mint-sdk'
import {
  getTokenByChainAndAddress,
  isAddressEqual,
  isProductToken,
} from '@indexcoop/tokenlists'
import { isAxiosError } from 'axios'

import { getApiV2Quote, GetApiV2QuoteQuery } from '@/gen'

import type { Address } from 'viem'

export interface IndexQuoteRequest {
  chainId: number
  account: string
  inputToken: string
  outputToken: string
  inputAmount: string
  slippage: number
}

type QuoteResult =
  | { data: GetApiV2QuoteQuery['Response']; status: 200 }
  | { data: { message: string }; status: 400 | 404 | 500 }

export async function getQuote(
  request: IndexQuoteRequest,
): Promise<QuoteResult> {
  try {
    const {
      account,
      chainId,
      inputToken: inputTokenAddress,
      inputAmount,
      outputToken: outputTokenAddress,
      slippage,
    } = request

    const inputToken = getQuoteToken(inputTokenAddress as Address, chainId)
    const outputToken = getQuoteToken(outputTokenAddress as Address, chainId)

    if (
      !inputToken ||
      !outputToken ||
      (inputToken.isIndex && outputToken.isIndex)
    ) {
      return { data: { message: 'Bad Request' }, status: 400 }
    }

    const quoteRequest: {
      account: string
      chainId: string
      inputToken: string
      outputToken: string
      inputAmount: string
      slippage: string
    } = {
      account,
      chainId: String(chainId),
      inputToken: inputToken.quoteToken.address,
      outputToken: outputToken.quoteToken.address,
      inputAmount,
      slippage: String(slippage),
    }

    const { data: quote } = await getApiV2Quote(quoteRequest)

    if (!quote) {
      return { data: { message: 'No quote found.' }, status: 404 }
    }

    return { data: quote, status: 200 }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        data: error.response.data,
        status: error.response.status as 400 | 404 | 500,
      }
    }

    return { data: { message: 'Unknown error' }, status: 500 }
  }
}

function getQuoteToken(
  token: Address,
  chainId: number,
): { quoteToken: QuoteToken; isIndex: boolean } | null {
  if (isAddressEqual(token, EthAddress)) {
    return {
      quoteToken: {
        symbol: 'ETH',
        decimals: 18,
        address: EthAddress,
      },
      isIndex: false,
    }
  }
  const listedToken = getTokenByChainAndAddress(chainId, token)
  if (!listedToken) return null
  return {
    quoteToken: {
      symbol: listedToken.symbol,
      decimals: listedToken.decimals,
      address: listedToken.address,
    },
    isIndex: isProductToken(listedToken),
  }
}
