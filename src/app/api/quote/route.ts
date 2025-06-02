import { EthAddress, type QuoteToken } from '@indexcoop/flash-mint-sdk'
import {
  getTokenByChainAndAddress,
  isAddressEqual,
  isProductToken,
} from '@indexcoop/tokenlists'
import { isAxiosError } from 'axios'
import { NextResponse } from 'next/server'

import { getApiV2Quote } from '@/gen'

import type { NextRequest } from 'next/server'
import type { Address } from 'viem'

export interface IndexQuoteRequest {
  chainId: number
  account: string
  inputToken: string
  outputToken: string
  inputAmount: string
  slippage: number
}

export async function POST(req: NextRequest) {
  try {
    const request: IndexQuoteRequest = await req.json()
    const {
      account,
      chainId,
      inputToken: inputTokenAddress,
      inputAmount,
      outputToken: outputTokenAddress,
      slippage,
    } = request

    const inputToken = getQuoteToken(inputTokenAddress, chainId)
    const outputToken = getQuoteToken(outputTokenAddress, chainId)

    if (
      !inputToken ||
      !outputToken ||
      (inputToken.isIndex && outputToken.isIndex)
    ) {
      return BadRequest('Bad Request')
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
      return NextResponse.json({ message: 'No quote found.' }, { status: 404 })
    }

    return NextResponse.json(quote, { status: 200 })
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      })
    }

    return NextResponse.json(error, { status: 500 })
  }
}

function BadRequest(errorMessage: string) {
  return NextResponse.json({ message: errorMessage }, { status: 400 })
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
