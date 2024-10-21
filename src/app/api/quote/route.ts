import { FlashMintQuoteProvider, QuoteToken } from '@indexcoop/flash-mint-sdk'
import { BigNumber } from 'ethers'
import { NextRequest, NextResponse } from 'next/server'
import { parseEther } from 'viem'

import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getConfiguredZeroExSwapQuoteProvider } from '@/lib/utils/api/zeroex'
import { getAlchemyBaseUrl } from '@/lib/utils/urls'

interface IndexQuoteRequest {
  chainId: number
  takerAddress: string
  inputToken: string
  outputToken: string
  inputAmount: string
}

export async function POST(req: NextRequest) {
  try {
    const request: IndexQuoteRequest = await req.json()
    console.log(request)
    const { chainId } = request

    // Input/output token should be of type QuoteToken with the following properties
    const inputToken: QuoteToken = {
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    }
    const outputToken: QuoteToken = {
      symbol: 'icETH',
      decimals: 18,
      address: '0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84',
    }

    // Add a RPC URL e.g. from Alchemy
    const rpcUrl =
      getAlchemyBaseUrl(chainId) + process.env.NEXT_PUBLIC_ALCHEMY_ID
    console.log(rpcUrl)

    // Use the 0x swap quote provider configured to your needs e.g. custom base url -
    // or provide your own adapter implementing the `SwapQuoteProvider` interface
    const zeroexSwapQuoteProvider =
      getConfiguredZeroExSwapQuoteProvider(chainId)
    const quoteProvider = new FlashMintQuoteProvider(
      rpcUrl,
      zeroexSwapQuoteProvider,
    )
    console.log(zeroexSwapQuoteProvider)
    console.log(quoteProvider)
    const quote = await quoteProvider.getQuote({
      isMinting: true,
      inputToken,
      outputToken,
      indexTokenAmount: BigNumber.from(parseEther('1').toString()),
      slippage: 0.1,
    })

    console.log(quote)

    return NextResponse.json({
      type: QuoteType.flashmint,
      chainId: 1,
      contract: '',
      takerAddress: '',
      inputToken: '',
      outputToken: '',
      inputAmount: '',
      outputAmount: '',
      rawResponse: {},
      transaction: {
        from: '',
        to: '',
        data: '',
        value: '0',
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
