import { Ethereum2xFlexibleLeverageIndex } from '@/constants/tokens'

import { Quote, QuoteType } from '../../types'
import { BigNumber } from 'ethers'

interface RedemptionQuoteRequest {
  gasPrice: bigint
}

export async function getEnhancedRedemptionQuote(
  request: RedemptionQuoteRequest
): Promise<Quote | null> {
  const { gasPrice } = request
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
}
