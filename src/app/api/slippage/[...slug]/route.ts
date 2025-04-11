import {
  getTokenByChainAndAddress,
  getTokenByChainAndSymbol,
} from '@indexcoop/tokenlists'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { isAddress, parseUnits } from 'viem'

import { getQuote } from '@/app/api/quote/utils'
import { formatWei } from '@/lib/utils'
import { fetchTokenMetrics } from '@/lib/utils/api/index-data-provider'

import type { NextRequest } from 'next/server'

const slippageDefault = 0.5
const slippageMax = 5.5

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string[] } },
): Promise<Response> {
  try {
    const { slug } = params
    const chainId = Number(slug[0])
    const address = slug[1]

    if (!address || !isAddress(address)) {
      return NextResponse.json('Bad Request', { status: 400 })
    }

    const token = getTokenByChainAndAddress(chainId, address)
    const usdc = getTokenByChainAndSymbol(chainId, 'USDC')

    if (!token || !usdc) {
      return NextResponse.json('Bad Request', { status: 400 })
    }

    const headersList = await headers()
    const host = headersList.get('host')
    const metrics = await fetchTokenMetrics({
      hostname:
        process.env.NODE_ENV === 'development'
          ? `http://${host}`
          : `https://${host}`,
      chainId,
      tokenAddress: address,
      metrics: ['nav'],
    })

    const nav = metrics?.NetAssetValue
    const inputAmount = nav === undefined ? '1000' : (nav * 1.1).toString()

    if (!nav) {
      return NextResponse.json(
        {
          chainId,
          address,
          slippage: slippageDefault,
        },
        { status: 200 },
      )
    }

    const quoteRequest: {
      account: string
      chainId: string
      inputToken: string
      outputToken: string
      inputAmount: string
      outputAmount: string
      slippage: string
    } = {
      account: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      chainId: String(chainId),
      inputToken: usdc.address,
      outputToken: token.address,
      // At the moment, we always wanna set both (inputAmount and indexTokenAmount)
      inputAmount: parseUnits(inputAmount.toString(), usdc.decimals).toString(),
      outputAmount: parseUnits('1', token.decimals).toString(),
      slippage: String(0.5),
    }

    const quote = await getQuote(quoteRequest)

    const quoteUsd = Number.parseFloat(
      formatWei(BigInt(quote.inputAmount), usdc.decimals),
    )

    const buffer = 1.2 // +20% on top of calc slippage
    const slippage = ((quoteUsd - nav) / nav) * buffer

    const slippagePercentage = slippage * 100
    const slippageOrMax =
      slippagePercentage > slippageMax ? slippageMax : slippagePercentage

    return NextResponse.json(
      {
        chainId,
        address,
        slippage: slippage < 0 ? slippageDefault : slippageOrMax,
      },
      { status: 200 },
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
