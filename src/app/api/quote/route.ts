import { EthAddress, type QuoteToken } from '@indexcoop/flash-mint-sdk'
import {
  getTokenByChainAndAddress,
  isAddressEqual,
  isProductToken,
} from '@indexcoop/tokenlists'
import { isAxiosError } from 'axios'
import { NextRequest, NextResponse } from 'next/server'

import { getApiV2Quote } from '@/gen'

import type { Address } from 'viem'

interface IndexQuoteRequest {
  chainId: number
  account: string
  inputToken: string
  outputToken: string
  inputAmount: string
  slippage: number
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

export async function POST(req: NextRequest) {
  try {
    const request = (await req.json()) as IndexQuoteRequest
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
      return NextResponse.json({ message: 'Bad Request' }, { status: 400 })
    }

    const quoteRequest = {
      account,
      chainId: String(chainId),
      inputToken: inputToken.quoteToken.address,
      outputToken: outputToken.quoteToken.address,
      inputAmount,
      slippage: String(slippage),
    }

    const { data: quote } = await getApiV2Quote(quoteRequest)

    if (!quote) {
      return NextResponse.json({ message: 'No quote found.' }, { status: 404 })
    }

    return NextResponse.json(quote)
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      })
    }

    return NextResponse.json({ message: 'Unknown error' }, { status: 500 })
  }
}
