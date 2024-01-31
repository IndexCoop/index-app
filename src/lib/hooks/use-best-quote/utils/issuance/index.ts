import { BigNumber } from 'ethers'
import { Address, PublicClient } from 'viem'
import { Token } from '@indexcoop/flash-mint-sdk'

import { Ethereum2xFlexibleLeverageIndex } from '@/constants/tokens'

import { Quote, QuoteType } from '../../types'
import { RedemptionProvider } from './redemption'

interface RedemptionQuoteRequest {
  inputToken: Token
  outputToken: Token
  indexTokenAmount: bigint // input for redemption
  inputTokenPrice: number
  outputTokenPrice: number
  nativeTokenPrice: number
  gasPrice: bigint
  slippage: number
}

export async function getEnhancedRedemptionQuote(
  request: RedemptionQuoteRequest,
  publicClient: PublicClient
): Promise<Quote | null> {
  const { indexTokenAmount, inputToken, gasPrice, outputToken } = request
  if (inputToken.symbol !== Ethereum2xFlexibleLeverageIndex.symbol) return null
  // FIXME: use new 2x token
  if (outputToken.symbol !== Ethereum2xFlexibleLeverageIndex.symbol) return null
  try {
    const redemptionProvider = new RedemptionProvider(publicClient)
    const componentsUnits =
      await redemptionProvider.getComponentRedemptionUnits(
        inputToken.address! as Address,
        indexTokenAmount
      )
    console.log('componentsUnits:', componentsUnits)
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
      indexTokenAmount: BigNumber.from(indexTokenAmount.toString()),
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
