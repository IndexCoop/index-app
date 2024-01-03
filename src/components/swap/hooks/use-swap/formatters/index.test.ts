import { TradeDetailTokenPrices } from '../../../components/trade-details'

import { getFormattedTokenPrice, getFormattedTokenPrices } from './'

describe('getFormattedTokenPrice()', () => {
  test('returns correct formatting', async () => {
    const formattedPrice = getFormattedTokenPrice('ETH', 'USDC', 1500 / 1)
    const expectedResult = '1 ETH = 1500 USDC'
    expect(formattedPrice).toEqual(expectedResult)
  })

  test('returns correct formatting for numbers lower 1', async () => {
    const formattedPrice = getFormattedTokenPrice('ETH', 'USDC', 1 / 234)
    const expectedResult = '1 ETH = 0.0043 USDC'
    expect(formattedPrice).toEqual(expectedResult)
  })
})

describe('getFormattedTokenPrices()', () => {
  test('returns correct formatting', async () => {
    const tokenPrices = getFormattedTokenPrices('ETH', 1, 1500, 'USDC', 1520, 1)
    const expectedResult: TradeDetailTokenPrices = {
      inputTokenPrice: '1 ETH = 1520 USDC',
      inputTokenPriceUsd: '($1500.00)',
      outputTokenPrice: '1 USDC = 0.0007 ETH',
      outputTokenPriceUsd: '($1.00)',
    }
    expect(tokenPrices).toEqual(expectedResult)
  })
})
