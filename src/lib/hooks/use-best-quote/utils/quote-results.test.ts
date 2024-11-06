import { BigNumber } from 'ethers'

import {
  Bitcoin2xFlexibleLeverageIndex,
  ETH,
  HighYieldETHIndex,
  IndexCoopBitcoin2xIndex,
} from '@/constants/tokens'

import { Quote, QuoteType, ZeroExQuote } from '../types'

import { getQuoteResults } from './quote-results'

describe('getQuoteResults', () => {
  it('returns redemption quote', async () => {
    const redemptionQuote = mockQuote
    redemptionQuote.type = QuoteType.redemption
    const quoteResults = getQuoteResults(
      IndexCoopBitcoin2xIndex,
      Bitcoin2xFlexibleLeverageIndex,
      IndexCoopBitcoin2xIndex,
      null,
      null,
      null,
      redemptionQuote,
    )
    expect(quoteResults.bestQuote).toEqual(QuoteType.redemption)
    const results = quoteResults.results
    expect(results.flashmint?.quote).toBeNull()
    expect(results.index?.quote).toBeNull()
    expect(results.issuance?.quote).toBeNull()
    expect(results.redemption).toEqual({
      type: QuoteType.redemption,
      isAvailable: true,
      quote: redemptionQuote,
      error: null,
    })
  })

  it('returns best quote', async () => {
    const flashmintQuote = mockQuote
    flashmintQuote.type = QuoteType.flashmint
    flashmintQuote.fullCostsInUsd = 9
    flashmintQuote.outputTokenAmountUsdAfterFees = 10
    const indexQuote: ZeroExQuote = {
      ...mockQuote,
      fullCostsInUsd: 10,
      outputTokenAmountUsdAfterFees: 1,
      minOutput: BigInt(0),
      sources: [{ name: 'LiFi', proportion: '1' }],
    }
    const quoteResults = getQuoteResults(
      HighYieldETHIndex,
      ETH,
      HighYieldETHIndex,
      indexQuote,
      flashmintQuote,
      null,
      null,
    )
    expect(quoteResults.bestQuote).toEqual(QuoteType.flashmint)
    const results = quoteResults.results
    expect(results.issuance?.quote).toBeNull()
    expect(results.redemption?.quote).toBeNull()
    expect(results.flashmint?.quote).toEqual(flashmintQuote)
    expect(results.index?.quote).toEqual(indexQuote)
  })
})

const mockQuote: Quote = {
  type: QuoteType.flashmint,
  chainId: 1,
  contract: '0x0',
  isMinting: true,
  inputToken: Bitcoin2xFlexibleLeverageIndex,
  outputToken: IndexCoopBitcoin2xIndex,
  gas: BigInt(0),
  gasPrice: BigInt(0),
  gasCosts: BigInt(0),
  gasCostsInUsd: 0,
  fullCostsInUsd: 0,
  priceImpact: 0,
  indexTokenAmount: BigInt(0),
  inputOutputTokenAmount: BigInt(0),
  // Return additionally for convenience to avoid
  // having to determine based on isMinting
  inputTokenAmount: BigInt(0),
  inputTokenAmountUsd: 0,
  outputTokenAmount: BigInt(0),
  outputTokenAmountUsd: 0,
  outputTokenAmountUsdAfterFees: 0,
  inputTokenPrice: 0,
  outputTokenPrice: 0,
  slippage: 0,
  tx: {
    account: '0x0',
    to: '0x0',
    data: '0x',
    value: BigNumber.from(0),
  },
}
