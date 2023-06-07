import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { MoneyMarketIndex, Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useBalanceData } from '@/lib/providers/Balances'
import { GasStation } from '@/lib/utils/api/gasStation'
import { getConfiguredZeroExApi } from '@/lib/utils/api/zeroExApi'
import { getNetworkKey } from '@/lib/utils/api/zeroExUtils'
import { getAddressForToken } from '@/lib/utils/tokens'

import { useIssuanceQuote } from './issuance/useIssuanceQuote'
import { getEnhancedFlashMintQuote } from './useBestQuote/flashMint'
import { getEnhancedFlashMintLeveragedQuote } from './useBestQuote/flashMintLeveraged'
import { getEnhancedFlashMintNotionalQuote } from './useBestQuote/flashMintNotional'
import { getEnhancedFlashMintZeroExQuote } from './useBestQuote/flashMintZeroEx'
import {
  EnhancedFlashMintQuote,
  ExchangeIssuanceLeveragedQuote,
  ExchangeIssuanceZeroExQuote,
  FlashMintNotionalQuote,
} from './useBestQuote'
import { useWallet } from './useWallet'

type FlashMintPerpQuote = {
  inputOutputTokenAmount: BigNumber | null
}

export type FlashMintQuoteResult = {
  quotes: {
    flashMint: EnhancedFlashMintQuote | null
    flashMintLeveraged: ExchangeIssuanceLeveragedQuote | null
    flashMintNotional: FlashMintNotionalQuote | null
    flashMintPerp: FlashMintPerpQuote | null
    flashMintZeroEx: ExchangeIssuanceZeroExQuote | null
  }
  inputTokenBalance: BigNumber
  slippage: number
}

export const useFlashMintQuote = () => {
  const { chainId } = useNetwork()
  const { getTokenBalance } = useBalanceData()
  const { provider, signer } = useWallet()
  const { getQuote } = useIssuanceQuote()

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [quoteResult, setQuoteResult] = useState<FlashMintQuoteResult | null>(
    null
  )

  /**
   *
   * @param slippage  The max acceptable slippage, e.g. 3 for 3 %
   */
  const fetchQuote = async (
    isMinting: boolean,
    indexToken: Token,
    inputOutputToken: Token,
    indexTokenAmount: BigNumber,
    sellTokenPrice: number,
    nativeTokenPrice: number,
    slippage: number
  ) => {
    if (!indexTokenAmount.gt(BigNumber.from(0))) {
      setQuoteResult(null)
      return
    }

    const inputToken = isMinting ? inputOutputToken : indexToken
    const outputToken = isMinting ? indexToken : inputOutputToken
    const inputTokenAddress = getAddressForToken(inputToken, chainId)
    const outputTokenAddress = getAddressForToken(outputToken, chainId)

    if (!provider || !chainId) {
      console.error('Error fetching quotes - no provider or chain id present')
      return
    }

    if (!inputTokenAddress || !outputTokenAddress) {
      console.log(inputTokenAddress, 'inputTokenAddress')
      console.log(outputTokenAddress, 'outputTokenAddress')
      console.error('Error can not determine input/ouput token address')
      return
    }

    setIsFetching(true)

    let flashMintQuote: EnhancedFlashMintQuote | null = null
    let flashMintLeveragedQuote: ExchangeIssuanceLeveragedQuote | null = null
    let flashMintNotionalQuote: FlashMintNotionalQuote | null = null
    let flashMintPerpQuote: FlashMintPerpQuote | null = null
    let flashMintZeroExQuote: ExchangeIssuanceZeroExQuote | null = null

    const inputTokenBalance =
      getTokenBalance(inputToken.symbol, chainId) ?? BigNumber.from(0)

    const isOptimismNetwork = chainId === 10
    if (indexToken.symbol === MoneyMarketIndex.symbol) {
      const gasStation = new GasStation(provider)
      const gasPrice = await gasStation.getGasPrice()
      flashMintQuote = await getEnhancedFlashMintQuote(
        isMinting,
        inputTokenAddress,
        outputTokenAddress,
        inputToken,
        outputToken,
        indexTokenAmount,
        sellTokenPrice,
        nativeTokenPrice,
        gasPrice,
        slippage,
        chainId,
        provider,
        signer
      )
    } else if (isOptimismNetwork) {
      const estimatedQuoteAmount = await getQuote(
        isMinting,
        indexToken,
        indexTokenAmount
      )
      flashMintPerpQuote = {
        inputOutputTokenAmount: estimatedQuoteAmount,
      }
    } else {
      const gasStation = new GasStation(provider)
      const gasPrice = await gasStation.getGasPrice()

      // Create an instance of ZeroExApi (to pass to quote functions)
      const networkKey = getNetworkKey(chainId)
      const swapPathOverride = `/${networkKey}/swap/v1/quote`
      const zeroExApi = getConfiguredZeroExApi(swapPathOverride)

      flashMintLeveragedQuote = await getEnhancedFlashMintLeveragedQuote(
        isMinting,
        inputTokenAddress,
        outputTokenAddress,
        inputTokenBalance,
        inputToken,
        outputToken,
        indexTokenAmount,
        sellTokenPrice,
        nativeTokenPrice,
        gasPrice,
        slippage,
        chainId,
        provider,
        zeroExApi,
        signer
      )

      flashMintZeroExQuote = await getEnhancedFlashMintZeroExQuote(
        isMinting,
        inputTokenAddress,
        outputTokenAddress,
        inputTokenBalance,
        inputToken,
        outputToken,
        indexTokenAmount,
        sellTokenPrice,
        nativeTokenPrice,
        gasPrice,
        slippage,
        chainId,
        provider,
        zeroExApi,
        signer
      )

      flashMintNotionalQuote = await getEnhancedFlashMintNotionalQuote(
        isMinting,
        inputToken,
        outputToken,
        indexTokenAmount,
        gasPrice,
        sellTokenPrice,
        nativeTokenPrice,
        slippage,
        chainId,
        provider,
        signer
      )
    }

    const quoteResult: FlashMintQuoteResult = {
      quotes: {
        flashMint: flashMintQuote,
        flashMintLeveraged: flashMintLeveragedQuote,
        flashMintNotional: flashMintNotionalQuote,
        flashMintPerp: flashMintPerpQuote,
        flashMintZeroEx: flashMintZeroExQuote,
      },
      inputTokenBalance,
      slippage,
    }

    setQuoteResult(quoteResult)
    setIsFetching(false)
  }

  return {
    fetchQuote,
    isFetchingQuote: isFetching,
    quoteResult,
  }
}
