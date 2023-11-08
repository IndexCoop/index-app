import { colors } from '@/lib/styles/colors'

import { TradeDetailTokenPrices } from '../swap/components/trade-details'

import {
  getFormattedTokenPrice,
  getFormattedTokenPrices,
  getPriceImpact,
  getPriceImpactColorCoding,
} from './QuickTradeFormatter'

describe('getFormattedTokenPrice()', () => {
  test('returns correct formatting', async () => {
    const formattedPrice = getFormattedTokenPrice('ETH', 'USDC', 1500, 1)
    const expectedResult = '1 ETH = 1500 USDC'
    expect(formattedPrice).toEqual(expectedResult)
  })

  test('returns correct formatting for numbers lower 1', async () => {
    const formattedPrice = getFormattedTokenPrice('ETH', 'USDC', 1, 234)
    const expectedResult = '1 ETH = 0.004 USDC'
    expect(formattedPrice).toEqual(expectedResult)
  })
})

describe('getFormattedTokenPrices()', () => {
  test('returns correct formatting', async () => {
    const tokenPrices = getFormattedTokenPrices('ETH', 1500, 'USDC', 1)
    const expectedResult: TradeDetailTokenPrices = {
      inputTokenPrice: '1 ETH = 1500 USDC',
      inputTokenPriceUsd: '($1500.00)',
      outputTokenPrice: '1 USDC = 0.001 ETH',
      outputTokenPriceUsd: '($1.00)',
    }
    expect(tokenPrices).toEqual(expectedResult)
  })
})

describe('getPriceImpact()', () => {
  test('should return null if input/output token amount smaller or equal 0', async () => {
    const priceImpactNoInputAmount = getPriceImpact(0, 1, 1, 1)
    expect(priceImpactNoInputAmount).toBeNull()
    const priceImpactNoOutputAmount = getPriceImpact(1, 1, 0, 1)
    expect(priceImpactNoOutputAmount).toBeNull()
  })

  test('should return correct price impact for positive price change', async () => {
    const inputTokenAmount = 30
    const inputTokenPrice = 1720
    const outputokenAmount = 29
    const outputTokenPrice = 1980
    const expectedResult = '11.28'
    const priceImpact = getPriceImpact(
      inputTokenAmount,
      inputTokenPrice,
      outputokenAmount,
      outputTokenPrice
    )
    expect(priceImpact).not.toBeNull()
    expect(priceImpact?.toFixed(2)).toEqual(expectedResult)
  })

  test('should return correct price impact for negative price change', async () => {
    const inputTokenAmount = 1
    const inputTokenPrice = 1000
    const outputokenAmount = 1
    const outputTokenPrice = 500
    const expectedResult = -50
    const priceImpact = getPriceImpact(
      inputTokenAmount,
      inputTokenPrice,
      outputokenAmount,
      outputTokenPrice
    )
    expect(priceImpact).not.toBeNull()
    expect(priceImpact).toEqual(expectedResult)
  })
})

describe('getPriceImpaceColorCoding()', () => {
  test('should return correct color for > 5% price impact', async () => {
    const colorCoding = getPriceImpactColorCoding(-5.1, true)
    expect(colorCoding).toEqual(colors.icRed)
  })

  test('should return correct color for price impact > 3% < 5%', async () => {
    const colorCoding = getPriceImpactColorCoding(-3.1, true)
    expect(colorCoding).toEqual(colors.icBlue)
  })

  test('should return correct color for price impact < 3%', async () => {
    const colorCodingDarkMode = getPriceImpactColorCoding(2, true)
    expect(colorCodingDarkMode).toEqual(colors.icGrayDarkMode)
    const colorCodingLightMode = getPriceImpactColorCoding(2, false)
    expect(colorCodingLightMode).toEqual(colors.icGrayLightMode)
  })
})
