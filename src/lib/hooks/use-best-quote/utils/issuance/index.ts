import { BigNumber } from 'ethers'
import { Token } from '@indexcoop/flash-mint-sdk'

import { Ethereum2xFlexibleLeverageIndex } from '@/constants/tokens'

import { Quote, QuoteType } from '../../types'

interface RedemptionQuoteRequest {
  inputToken: Token
  outputToken: Token
  indexTokenAmount: Token // input for redemption
  inputTokenPrice: number
  outputTokenPrice: number
  nativeTokenPrice: number
  gasPrice: bigint
  slippage: number
}

export async function getEnhancedRedemptionQuote(
  request: RedemptionQuoteRequest
): Promise<Quote | null> {
  const { inputToken, gasPrice, outputToken } = request
  if (inputToken.symbol !== Ethereum2xFlexibleLeverageIndex.symbol) return null
  // FIXME: use new 2x token
  if (outputToken.symbol !== Ethereum2xFlexibleLeverageIndex.symbol) return null
  // TODO:
  //   const currencies = getCurrencyTokensForIndex(indexToken, chainId)
  //   // Allow only supported currencies
  //   const isAllowedCurrency =
  //     currencies.filter((curr) => curr.symbol === inputOutputToken.symbol)
  //       .length > 0
  //   if (!isAllowedCurrency) return null
  try {
    return {
      type: QuoteType.redemption,
      chainId: 1,
      contract: '0x04b59F9F09750C044D7CfbC177561E409085f0f3',
      isMinting: false,
      inputToken: Ethereum2xFlexibleLeverageIndex,
      outputToken: Ethereum2xFlexibleLeverageIndex, // FIXME: use new 2x token
      gas: BigNumber.from(0), // TODO:
      gasPrice: BigNumber.from(gasPrice.toString()),
      // TODO:
      gasCosts: BigNumber.from(0),
      gasCostsInUsd: 0,
      fullCostsInUsd: 0,
      priceImpact: 0,
      indexTokenAmount: BigNumber.from(0),
      inputOutputTokenAmount: BigNumber.from(0),
      inputTokenAmount: BigNumber.from(0),
      inputTokenAmountUsd: 0,
      outputTokenAmount: BigNumber.from(0),
      outputTokenAmountUsd: 0,
      inputTokenPrice: 0,
      outputTokenPrice: 0,
      slippage: 0,
      tx: {},
    }
  } catch (e) {
    console.warn('Error fetching redemption quote', e)
    return null
  }
}
