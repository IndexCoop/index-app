import { Token, TradeType } from '@uniswap/sdk-core'
import {
  AlphaRouter,
  CurrencyAmount,
  SwapRoute,
} from '@uniswap/smart-order-router'
import { providers } from 'ethers'
import { NextRequest, NextResponse } from 'next/server'

import { AlchemyMainnetUrl } from '@/constants/server'

export interface UniswapQuoteRequest {
  chainId: number
  inputToken: string
  outputToken: string
  inputTokenDecimals: number
  outputTokenDecimals: number
  // Either one of these must be set
  inputAmount?: string
  outputAmount?: string
}

export async function POST(request: NextRequest) {
  const body: UniswapQuoteRequest = await request.json()
  const { chainId, inputAmount, outputAmount } = body
  try {
    const isExactOutput = outputAmount !== undefined

    const inputTokenCurrency = new Token(
      chainId,
      body.inputToken,
      body.inputTokenDecimals,
    )
    const outputTokenCurrency = new Token(
      chainId,
      body.outputToken,
      body.outputTokenDecimals,
    )

    const router = new AlphaRouter({
      chainId,
      // TODO: chain agnostic
      provider: new providers.JsonRpcProvider(AlchemyMainnetUrl),
    })

    let swapRoute: SwapRoute | null = null
    if (isExactOutput) {
      swapRoute = await router.route(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        CurrencyAmount.fromRawAmount(outputTokenCurrency, outputAmount!),
        inputTokenCurrency,
        TradeType.EXACT_OUTPUT,
      )
    } else {
      swapRoute = await router.route(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        CurrencyAmount.fromRawAmount(inputTokenCurrency, inputAmount!),
        outputTokenCurrency,
        TradeType.EXACT_INPUT,
      )
    }
    console.log(swapRoute)
    return NextResponse.json({ route: swapRoute })
  } catch (error) {
    console.log('Error getting Uniswap swap quote:')
    console.log(error)
    return NextResponse.json({}, { status: 500 })
  }
}
