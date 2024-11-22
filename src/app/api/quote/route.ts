import {
  EthAddress,
  FlashMintQuoteProvider,
  FlashMintQuoteRequest,
  QuoteToken,
} from '@indexcoop/flash-mint-sdk'
import {
  getTokenByChainAndAddress,
  isAddressEqual,
  isProductToken,
} from '@indexcoop/tokenlists'
import { BigNumber } from 'ethers'
import { NextRequest, NextResponse } from 'next/server'
import { Address, isAddress } from 'viem'

import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getConfiguredZeroExSwapQuoteProvider } from '@/lib/utils/api/zeroex'
import { getAlchemyBaseUrl } from '@/lib/utils/urls'

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

    const rpcUrl = getAlchemyBaseUrl(chainId) + process.env.ALCHEMY_API_KEY
    const zeroexSwapQuoteProvider =
      getConfiguredZeroExSwapQuoteProvider(chainId)
    const quoteProvider = new FlashMintQuoteProvider(
      rpcUrl,
      zeroexSwapQuoteProvider,
    )

    const isMinting = outputToken.isIndex
    const quoteRequest: FlashMintQuoteRequest = {
      isMinting,
      inputToken: inputToken.quoteToken,
      outputToken: outputToken.quoteToken,
      indexTokenAmount: BigNumber.from(
        isMinting ? outputAmount! : inputAmount!,
      ),
      slippage,
    }
    if (isMintingIcUsd) {
      quoteRequest.inputTokenAmount =
        BigNumber.from(inputAmount) ?? BigNumber.from(0)
    }

    const quote = await quoteProvider.getQuote(quoteRequest)

    if (!quote) {
      return NextResponse.json({ message: 'No quote found.' }, { status: 404 })
    }

    return NextResponse.json({
      type: QuoteType.flashmint,
      chainId: quote.chainId,
      contract: quote.contract,
      contractType: quote.contractType,
      takerAddress: account,
      isMinting: quote.isMinting,
      inputToken: quote.inputToken,
      outputToken: quote.outputToken,
      indexTokenAmount: quote.indexTokenAmount.toString(),
      inputAmount: quote.inputAmount.toString(),
      outputAmount: quote.outputAmount.toString(),
      slippage: quote.slippage,
      transaction: quote.tx,
    })
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
