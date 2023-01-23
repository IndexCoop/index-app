import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DefiPulseIndex,
  DiversifiedStakedETHIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  icETHIndex,
  mainnetCurrencyTokens,
  MATIC,
  MetaverseIndex,
  optimismCurrencyTokens,
  polygonCurrencyTokens,
  WETH,
} from 'constants/tokens'

import {
  getAddressForToken,
  getCurrencyTokens,
  getNativeToken,
  isLeveragedToken,
} from './tokens'

describe('getAddressForToken()', () => {
  test('should return undefined for undefined chain', async () => {
    const address = getAddressForToken(WETH, undefined)
    expect(address).toBeUndefined()
  })

  test('should return correct token address for WETH on Ethereum', async () => {
    const address = getAddressForToken(WETH, 1)
    expect(address).toBeDefined()
    expect(address).toEqual(WETH.address)
  })

  test('should return correct token address for WETH on Optimism', async () => {
    const address = getAddressForToken(WETH, 10)
    expect(address).toBeDefined()
    expect(address).toEqual(WETH.optimismAddress)
  })

  test('should return correct token address for WETH on Polygon', async () => {
    const address = getAddressForToken(WETH, 137)
    expect(address).toBeDefined()
    expect(address).toEqual(WETH.polygonAddress)
  })
})

describe('getCurrencyTokens()', () => {
  test('returns empty array for unsupported chain', async () => {
    const currencyTokens = getCurrencyTokens(100)
    expect(currencyTokens).toEqual([])
  })

  test('returns correct currency tokens for mainnet', async () => {
    const currencyTokens = getCurrencyTokens(1)
    expect(currencyTokens).toEqual(mainnetCurrencyTokens)
  })

  test('returns correct currency tokens for optimism', async () => {
    const currencyTokens = getCurrencyTokens(10)
    expect(currencyTokens).toEqual(optimismCurrencyTokens)
  })

  test('returns correct currency tokens for polygon', async () => {
    const currencyTokens = getCurrencyTokens(137)
    expect(currencyTokens).toEqual(polygonCurrencyTokens)
  })
})

describe('getNativeToken()', () => {
  test('should return undefined for undefined chain', async () => {
    const nativeToken = getNativeToken(undefined)
    expect(nativeToken).toBeNull()
  })

  test('should return correct token address for WETH on Ethereum', async () => {
    const nativeToken = getNativeToken(1)
    expect(nativeToken).toBeDefined()
    expect(nativeToken).toEqual(ETH)
  })

  test('should return correct token address for WETH on Optimism', async () => {
    const nativeToken = getNativeToken(10)
    expect(nativeToken).toBeDefined()
    expect(nativeToken).toEqual(ETH)
  })

  test('should return correct token address for WETH on Polygon', async () => {
    const nativeToken = getNativeToken(137)
    expect(nativeToken).toBeDefined()
    expect(nativeToken).toEqual(MATIC)
  })
})

describe('isLeveragedToken()', () => {
  test('should return false for non leveraged tokens', async () => {
    const bed = isLeveragedToken(BedIndex)
    const dpi = isLeveragedToken(DefiPulseIndex)
    const dsEth = isLeveragedToken(DiversifiedStakedETHIndex)
    const mvi = isLeveragedToken(MetaverseIndex)
    expect(bed).toBe(false)
    expect(dpi).toBe(false)
    expect(dsEth).toBe(false)
    expect(mvi).toBe(false)
  })

  test('should return true for leveraged tokens', async () => {
    const btc2xFli = isLeveragedToken(Bitcoin2xFlexibleLeverageIndex)
    const eth2xFli = isLeveragedToken(Ethereum2xFlexibleLeverageIndex)
    const icEth = isLeveragedToken(icETHIndex)
    expect(btc2xFli).toBe(true)
    expect(eth2xFli).toBe(true)
    expect(icEth).toBe(true)
  })
})
