import {
  EthAddress,
  FlashMintQuoteProvider,
  QuoteToken,
} from '@indexcoop/flash-mint-sdk'
import {
  getTokenByChainAndAddress,
  isAddressEqual,
  isIndexToken,
} from '@indexcoop/tokenlists'
import { BigNumber } from 'ethers'
import { NextRequest, NextResponse } from 'next/server'
import { Address, isAddress, parseEther } from 'viem'

import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getConfiguredZeroExSwapQuoteProvider } from '@/lib/utils/api/zeroex'
import { getAlchemyBaseUrl } from '@/lib/utils/urls'

interface IndexQuoteRequest {
  chainId: number
  account: string
  inputToken: string
  outputToken: string
  inputAmount?: string
  outputAmount?: string
}

export async function POST(req: NextRequest) {
  try {
    const request: IndexQuoteRequest = await req.json()
    console.log(request)
    const {
      // account,
      chainId,
      inputToken: inputTokenAddress,
      inputAmount,
      outputToken: outputTokenAddress,
      outputAmount,
    } = request

    if (!isAddress(inputTokenAddress) || !isAddress(outputTokenAddress)) {
      return NextResponse.json(
        {
          message: 'Bad Request',
        },
        { status: 400 },
      )
    }

    if (!inputAmount && !outputAmount) {
      return NextResponse.json(
        {
          message: 'Either `inputAmount` or outputAmount` needs to be set.',
        },
        { status: 400 },
      )
    }

    if (inputAmount && outputAmount) {
      return NextResponse.json(
        {
          message: 'You can only set `inputAmount` or outputAmount`.',
        },
        { status: 400 },
      )
    }

    const inputToken = getQuoteToken(inputTokenAddress, chainId)
    const outputToken = getQuoteToken(outputTokenAddress, chainId)
    console.log(inputToken)
    console.log(outputToken)

    if (
      !inputToken ||
      !outputToken ||
      (inputToken.isIndex && outputToken.isIndex)
    ) {
      return NextResponse.json(
        {
          message: 'Bad Request',
        },
        { status: 400 },
      )
    }

    const rpcUrl =
      getAlchemyBaseUrl(chainId) + process.env.NEXT_PUBLIC_ALCHEMY_ID
    const zeroexSwapQuoteProvider =
      getConfiguredZeroExSwapQuoteProvider(chainId)
    const quoteProvider = new FlashMintQuoteProvider(
      rpcUrl,
      zeroexSwapQuoteProvider,
    )

    const quote = await quoteProvider.getQuote({
      isMinting: outputToken.isIndex,
      inputToken: inputToken.quoteToken,
      outputToken: outputToken.quoteToken,
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
    isIndex: isIndexToken(listedToken),
  }
}
