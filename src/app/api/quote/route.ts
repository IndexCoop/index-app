import { EthAddress, QuoteToken } from '@indexcoop/flash-mint-sdk'
import {
  getTokenByChainAndAddress,
  isAddressEqual,
  isProductToken,
} from '@indexcoop/tokenlists'
import { NextRequest, NextResponse } from 'next/server'
import { Address, isAddress } from 'viem'

export interface IndexQuoteRequest {
  chainId: number
  account: string
  inputToken: string
  outputToken: string
  inputAmount?: string
  outputAmount?: string
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
      outputAmount,
      slippage,
    } = request

    if (slippage < 0 || slippage > 1) {
      return BadRequest('Bad Request')
    }

    if (!isAddress(inputTokenAddress) || !isAddress(outputTokenAddress)) {
      return BadRequest('Bad Request')
    }

    if (!inputAmount && !outputAmount) {
      return BadRequest(
        'Either `inputAmount` or outputAmount` needs to be set.',
      )
    }

    const inputToken = getQuoteToken(inputTokenAddress, chainId)
    const outputToken = getQuoteToken(outputTokenAddress, chainId)
    const isMintingIcUsd = outputToken?.quoteToken.symbol === 'icUSD'

    if (!isMintingIcUsd && inputAmount && outputAmount) {
      return BadRequest('You can only set `inputAmount` or outputAmount`.')
    }

    if (
      !inputToken ||
      !outputToken ||
      (inputToken.isIndex && outputToken.isIndex)
    ) {
      return BadRequest('Bad Request')
    }

    const isMinting = outputToken.isIndex
    const quoteRequest: {
      account: string
      chainId: string
      inputToken: string
      outputToken: string
      inputAmount?: string
      outputAmount?: string
      slippage: string
    } = {
      account,
      chainId: String(chainId),
      inputToken: inputToken.quoteToken.address,
      outputToken: outputToken.quoteToken.address,
      slippage: String(slippage),
    }
    if (isMinting) {
      quoteRequest.outputAmount = outputAmount
    } else {
      quoteRequest.inputAmount = inputAmount
    }
    if (isMintingIcUsd) {
      quoteRequest.inputAmount = inputAmount ?? '0'
    }

    const query = new URLSearchParams(quoteRequest).toString()
    const url = `https://api.indexcoop.com/v2/quote?${query}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.INDEX_COOP_API_V2_KEY,
      } as HeadersInit,
    })

    const quote = await response.json()

    if (!quote) {
      return NextResponse.json({ message: 'No quote found.' }, { status: 404 })
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error(error)
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
