import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ZeroExApi } from '@indexcoop/flash-mint-sdk'

import { IndexApiBaseUrl } from 'constants/server'
import { Token } from 'constants/tokens'
import { useBalances } from 'hooks/useBalance'
import { useNetwork } from 'hooks/useNetwork'
import { GasStation } from 'utils/api/gasStation'
import { getNetworkKey } from 'utils/api/zeroExUtils'
import { getAddressForToken } from 'utils/tokens'

import { useIssuanceQuote } from './issuance/useIssuanceQuote'
import { getEILeveragedQuote } from './useBestQuote/exchangeIssuanceLeveraged'
import { getEnhancedFlashMintZeroExQuote } from './useBestQuote/exchangeIssuanceZeroEx'
import {
  ExchangeIssuanceLeveragedQuote,
  ExchangeIssuanceZeroExQuote,
} from './useBestQuote'
import { useWallet } from './useWallet'

type FlashMintPerpQuote = {
  inputOutputTokenAmount: BigNumber | null
}

export type FlashMintQuoteResult = {
  quotes: {
    flashMintLeveraged: ExchangeIssuanceLeveragedQuote | null
    flashMintPerp: FlashMintPerpQuote | null
    flashMintZeroEx: ExchangeIssuanceZeroExQuote | null
  }
}

const defaultQuoteResult: FlashMintQuoteResult = {
  quotes: {
    flashMintLeveraged: null,
    flashMintPerp: null,
    flashMintZeroEx: null,
  },
}

export const useFlashMintQuote = () => {
  const { chainId } = useNetwork()
  const { getBalance } = useBalances()
  const { provider, signer } = useWallet()
  const { getQuote } = useIssuanceQuote()

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [quoteResult, setQuoteResult] =
    useState<FlashMintQuoteResult>(defaultQuoteResult)

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
      setQuoteResult(defaultQuoteResult)
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

    let flashMintLeveragedQuote: ExchangeIssuanceLeveragedQuote | null = null
    let flashMintPerpQuote: FlashMintPerpQuote | null = null
    let flashMintZeroExQuote: ExchangeIssuanceZeroExQuote | null = null

    const isOptimismNetwork = chainId === 10
    if (isOptimismNetwork) {
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
      const affilliateAddress = '0x37e6365d4f6aE378467b0e24c9065Ce5f06D70bF'
      const networkKey = getNetworkKey(chainId)
      const swapPathOverride = `/${networkKey}/swap/v1/quote`
      const zeroExApi = new ZeroExApi(
        `${IndexApiBaseUrl}/0x`,
        affilliateAddress,
        { 'X-INDEXCOOP-API-KEY': process.env.REACT_APP_INDEX_COOP_API! },
        swapPathOverride
      )

      flashMintLeveragedQuote = await getEILeveragedQuote(
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
        zeroExApi
      )

      const inputTokenBalance =
        getBalance(inputToken.symbol) ?? BigNumber.from(0)
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

      console.log('////////')
      console.log('exchangeIssuanceZeroExQuote', flashMintZeroExQuote)
      console.log('exchangeIssuanceLeveragedQuote', flashMintLeveragedQuote)
    }

    const quoteResult: FlashMintQuoteResult = {
      quotes: {
        flashMintLeveraged: flashMintLeveragedQuote,
        flashMintPerp: flashMintPerpQuote,
        flashMintZeroEx: flashMintZeroExQuote,
      },
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
