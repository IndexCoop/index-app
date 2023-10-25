import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useBalanceData } from '@/lib/providers/Balances'
import { GasStation } from '@/lib/utils/api/gas-station'
import { getAddressForToken } from '@/lib/utils/tokens'

import { EnhancedFlashMintQuote } from './useBestQuote'
import { getEnhancedFlashMintQuote } from './useBestQuote/flashMint'
import { useWallet } from './useWallet'

export type FlashMintQuoteResult = {
  quotes: {
    flashMint: EnhancedFlashMintQuote | null
  }
  inputTokenBalance: BigNumber
  slippage: number
}

export const useFlashMintQuote = () => {
  const { chainId } = useNetwork()
  const { getTokenBalance } = useBalanceData()
  const { provider, signer } = useWallet()

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

    const inputTokenBalance =
      getTokenBalance(inputToken.symbol, chainId) ?? BigNumber.from(0)

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

    const quoteResult: FlashMintQuoteResult = {
      quotes: {
        flashMint: flashMintQuote,
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
