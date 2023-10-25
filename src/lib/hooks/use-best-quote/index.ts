import { useState } from 'react'

import { providers } from 'ethers'

import { JsonRpcSigner } from '@ethersproject/providers'

import { useNetwork } from '@/lib/hooks/useNetwork'
import { GasStation } from '@/lib/utils/api/gas-station'
import { ZeroExData } from '@/lib/utils/api/zeroex-utils'
import { getAddressForToken } from '@/lib/utils/tokens'

import { useNativeTokenPrice } from '../use-token-price'
import { useWallet } from '../useWallet'

import { getEnhancedFlashMintQuote } from './flashmint'
import { getIndexTokenAmount } from './index-token-amount'
import {
  EnhancedFlashMintQuote,
  IndexQuoteRequest,
  Quote,
  QuoteType,
  ZeroExQuote,
} from './types'
import { get0xQuote } from './zeroex'

interface QuoteResult {
  bestQuote: QuoteType
  error: Error | null
  quotes: {
    flashmint: EnhancedFlashMintQuote | null
    zeroex: ZeroExQuote | null
  }
  isReasonPriceImpact: boolean
  savingsUsd: number
}

// TODO: ??
// const defaultQuoteResult: QuoteResult = {
//   bestQuote: QuoteType.zeroEx,
//   error: null,
//   quotes: {
//     flashmint: null,
//     zeroex: null,
//   },
//   isReasonPriceImpact: false,
//   savingsUsd: 0,
// }

export const useBestQuote = () => {
  const { provider, signer } = useWallet()
  const { chainId: networkChainId } = useNetwork()
  // Assume mainnet when no chain is connected (to be able to fetch quotes)
  const chainId = networkChainId ?? 1
  const nativeTokenPrice = useNativeTokenPrice(chainId)

  const [isFetching, setIsFetching] = useState<boolean>(false)
  //   const [quoteResult, setQuoteResult] =
  //     useState<QuoteResult>(defaultQuoteResult)
  //   const [quoteResultOptions, setQuoteResultOptions] =
  //     useState<MoreQuotesResult>({
  //       hasBetterQuote: false,
  //       isReasonPriceImpact: false,
  //       quotes: {
  //         flashMint: null,
  //       },
  //       savingsUsd: 0,
  //     })

  const fetchQuote = async (request: IndexQuoteRequest) => {
    const { inputToken, isMinting, outputToken } = request

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

    // TODO: check if token has 0x/flashmint option
    setIsFetching(true)
    const quote0x = await get0xQuote({
      ...request,
      chainId,
      nativeTokenPrice,
    })
    const quoteFlashMint = await getFlashMintQuote(
      {
        ...request,
        chainId,
        // TODO:
        dexData: {
          buyAmount: isMinting
            ? quote0x!.indexTokenAmount.toString()
            : quote0x!.inputOutputTokenAmount.toString(),
          estimatedPriceImpact: quote0x!.estimatedPriceImpact,
        },
        nativeTokenPrice,
      },
      provider,
      signer
    )
    // TODO: error handling
    // TODO: compare quotes
    // TODO: response modeling
    setIsFetching(false)
  }

  //     const fetchAndCompareMoreOptions = async () => {
  //       setIsFetchingMoreOptions(true)

  //       console.log('////////')
  //       console.log('exchangeIssuanceZeroExQuote', flashMintQuote)

  //       const bestQuote = getBestQuote(
  //         zeroExQuote?.fullCostsInUsd ?? null,
  //         flashMintQuote?.fullCostsInUsd ?? null,
  //         zeroExQuote?.priceImpact ?? 5
  //       )

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

  //       const flashMintIsBestQuote = bestQuote.type === QuoteType.flashMint
  //       const savingsUsd = getSavings()
  //       console.log(
  //         flashMintIsBestQuote,
  //         savingsUsd,
  //         flashMintQuote?.fullCostsInUsd,
  //         zeroExQuote?.fullCostsInUsd,
  //         'isBestQuote/savings'
  //       )

  //       const quoteResult: MoreQuotesResult = {
  //         hasBetterQuote: flashMintIsBestQuote,
  //         isReasonPriceImpact: bestQuote.priceImpact,
  //         quotes: {
  //           flashMint: flashMintIsBestQuote ? flashMintQuote : null,
  //         },
  //         savingsUsd,
  //       }

  //       setQuoteResultOptions(quoteResult)
  //       setIsFetchingMoreOptions(false)
  //     }

  //     console.log('FETCH MORE...')
  //     // The individual Flash Mint functions will check if the the token pair is eligible
  //     fetchAndCompareMoreOptions()

  //     const quoteResult: QuoteResult = {
  //       error: dexSwapError,
  //       quotes: {
  //         zeroEx: zeroExQuote,
  //       },
  //     }

  //     setQuoteResult(quoteResult)
  //     setIsFetching(false)
  //   }

  const quoteResult = {}

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
  /* Determine Set token amount based on different factors */
  let indexTokenAmount = getIndexTokenAmount(
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
