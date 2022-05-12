import { getPriceImpact } from './QuickTradeFormatter'

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
