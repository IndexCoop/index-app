import { getBestTradeOption, QuickTradeBestOption } from './QuickTrade'

describe('getBestTradeOption()', () => {
  test('should return 0x as best trade option', async () => {
    const bestTradeOption = getBestTradeOption(1, 2, 2, 3.5)
    expect(bestTradeOption).toEqual(QuickTradeBestOption.zeroEx)
  })

  test('should return EI as the best option', async () => {
    const bestTradeOption = getBestTradeOption(2, 1, 3, 1)
    expect(bestTradeOption).toEqual(QuickTradeBestOption.exchangeIssuance)
  })

  test('should return Leveraged EI as the best option', async () => {
    const bestTradeOption = getBestTradeOption(2, 2, 1, 1)
    expect(bestTradeOption).toEqual(
      QuickTradeBestOption.leveragedExchangeIssuance
    )
  })

  test('should return 0x if everything else is not defined', async () => {
    const bestTradeOption = getBestTradeOption(1, null, null, 1)
    expect(bestTradeOption).toEqual(QuickTradeBestOption.zeroEx)
  })

  test('should return EI if everything else is not defined', async () => {
    const bestTradeOption = getBestTradeOption(null, 1, null, 1)
    expect(bestTradeOption).toEqual(QuickTradeBestOption.exchangeIssuance)
  })

  test('should return Leveraged EI if everything else is not defined', async () => {
    const bestTradeOption = getBestTradeOption(null, null, 1, 1)
    expect(bestTradeOption).toEqual(
      QuickTradeBestOption.leveragedExchangeIssuance
    )
  })

  test('should NOT return 0x if price impact is too high', async () => {
    const bestTradeOption = getBestTradeOption(1, 1, null, 5)
    expect(bestTradeOption).toEqual(QuickTradeBestOption.exchangeIssuance)
    const bestTradeOption2 = getBestTradeOption(1, null, 1, 5)
    expect(bestTradeOption2).toEqual(
      QuickTradeBestOption.leveragedExchangeIssuance
    )
  })

  test('should NOT return 0x if price impact is too high (higher quotes)', async () => {
    const bestTradeOption = getBestTradeOption(1, 1.1, null, 5)
    expect(bestTradeOption).toEqual(QuickTradeBestOption.exchangeIssuance)
    const bestTradeOption2 = getBestTradeOption(1, null, 1.1, 5)
    expect(bestTradeOption2).toEqual(
      QuickTradeBestOption.leveragedExchangeIssuance
    )
  })
})
