import { useState } from 'react'

import { providers } from 'ethers'

import { JsonRpcSigner } from '@ethersproject/providers'

import { useNetwork } from '@/lib/hooks/useNetwork'
import { toWei } from '@/lib/utils'
import { GasStation } from '@/lib/utils/api/gas-station'
import {
  getAddressForToken,
  isAvailableForFlashMint,
  isAvailableForSwap,
} from '@/lib/utils/tokens'

import { useNativeTokenPrice } from '../use-token-price'
import { useWallet } from '../useWallet'

import { getBestQuote } from './best-quote'
import { maxPriceImpact } from './config'
import { getEnhancedFlashMintQuote } from './flashmint'
import { getIndexTokenAmount } from './index-token-amount'
import {
  EnhancedFlashMintQuote,
  IndexQuoteRequest,
  QuoteResult,
  QuoteType,
  ZeroExQuote,
} from './types'
import { get0xQuote } from './zeroex'

const defaultQuoteResult: QuoteResult = {
  bestQuote: QuoteType.zeroex,
  error: null,
  quotes: {
    flashmint: null,
    zeroex: null,
  },
  isReasonPriceImpact: false,
  savingsUsd: 0,
}

export const useBestQuote = () => {
  const { provider, signer } = useWallet()
  const { chainId: networkChainId } = useNetwork()
  // Assume mainnet when no chain is connected (to be able to fetch quotes)
  const chainId = networkChainId ?? 1
  const nativeTokenPrice = useNativeTokenPrice(chainId)

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [quoteResult, setQuoteResult] =
    useState<QuoteResult>(defaultQuoteResult)

  const fetchQuote = async (request: IndexQuoteRequest) => {
    const { inputToken, inputTokenAmount, isMinting, outputToken } = request

    // Right now we only allow setting the input amount, so no need to check
    // ouput token amount here
    const inputTokenAmountWei = toWei(inputTokenAmount, inputToken.decimals)
    if (inputTokenAmountWei.isZero() || inputTokenAmountWei.isNegative()) {
      setQuoteResult(defaultQuoteResult)
      return
    }

    console.log('--------')
    console.log(
      inputToken.symbol,
      outputToken.symbol,
      request.inputTokenAmount,
      'new-best-quote'
    )

    if (!provider || !chainId) {
      console.error('Error fetching quotes - no provider or chain id present')
      return
    }

    const inputTokenAddress = getAddressForToken(inputToken, chainId)
    const outputTokenAddress = getAddressForToken(outputToken, chainId)

    if (!inputTokenAddress || !outputTokenAddress) {
      console.log(inputTokenAddress, outputTokenAddress)
      console.error('Error can not determine input/ouput token address')
      return
    }

    setIsFetching(true)

    const indexToken = isMinting ? outputToken : inputToken
    const canFlashmintIndexToken = isAvailableForFlashMint(indexToken)
    const canSwapIndexToken = isAvailableForSwap(indexToken)

    console.log(canSwapIndexToken, canFlashmintIndexToken, 'can')

    let quote0x: ZeroExQuote | null = null
    let quoteFlashMint: EnhancedFlashMintQuote | null = null

    if (canSwapIndexToken) {
      quote0x = await get0xQuote({
        ...request,
        chainId,
        address: signer._address,
        nativeTokenPrice,
      })
    }

    if (canFlashmintIndexToken) {
      const buyAmount = isMinting
        ? quote0x!.indexTokenAmount.toString()
        : quote0x!.inputOutputTokenAmount.toString()
      console.log(buyAmount, 'buyAmount')
      quoteFlashMint = await getFlashMintQuote(
        {
          ...request,
          chainId,
          // TODO:
          dexData: {
            buyAmount,
            estimatedPriceImpact: quote0x!.estimatedPriceImpact,
          },
          nativeTokenPrice,
        },
        provider,
        signer
      )
    }

    const bestQuote = getBestQuote(
      quote0x?.fullCostsInUsd ?? null,
      quoteFlashMint?.fullCostsInUsd ?? null,
      quote0x?.priceImpact ?? maxPriceImpact
    )
    console.log(bestQuote.type, quote0x?.priceImpact)
    //       const getSavings = (): number => {
    //         if (!zeroExQuote) return 0
    //         if (bestQuote.type === QuoteType.flashMint && flashMintQuote) {
    //           return (
    //             (zeroExQuote.fullCostsInUsd ?? 0) -
    //             (flashMintQuote.fullCostsInUsd ?? 0)
    //           )
    //         }
    //         return 0
    //       }
    //       const savingsUsd = getSavings()
    setQuoteResult({
      bestQuote: bestQuote.type,
      // TODO:
      error: null,
      isReasonPriceImpact: bestQuote.priceImpact,
      quotes: {
        flashmint: quoteFlashMint,
        zeroex: quote0x,
      },
      // TODO: ?
      savingsUsd: 0,
    })
    // TODO: error handling
    // TODO: compare quotes
    // TODO: response modeling
    setIsFetching(false)
  }

  return {
    fetchQuote,
    isFetching,
    quoteResult,
  }
}

interface FlashMintQuoteRequest extends IndexQuoteRequest {
  chainId: number
  dexData: { buyAmount: string; estimatedPriceImpact: string } | null
  nativeTokenPrice: number
}

async function getFlashMintQuote(
  request: FlashMintQuoteRequest,
  provider: providers.JsonRpcProvider,
  signer: JsonRpcSigner
) {
  const {
    chainId,
    dexData,
    inputToken,
    inputTokenAmount,
    inputTokenPrice,
    isMinting,
    nativeTokenPrice,
    outputToken,
    outputTokenPrice,
    slippage,
  } = request

  /* Determine index token amount based on different factors */
  const indexTokenAmount = getIndexTokenAmount(
    isMinting,
    inputTokenAmount,
    inputToken.decimals,
    inputTokenPrice,
    outputTokenPrice,
    dexData
  )

  const gasStation = new GasStation(provider)
  const gasPrice = await gasStation.getGasPrice()

  const flashMintQuote = await getEnhancedFlashMintQuote(
    isMinting,
    inputToken,
    outputToken,
    indexTokenAmount,
    inputTokenPrice,
    nativeTokenPrice,
    gasPrice,
    slippage,
    chainId,
    provider,
    signer
  )
  return flashMintQuote
}
