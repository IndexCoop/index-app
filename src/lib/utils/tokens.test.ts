import { currencies } from '@/constants/tokenlists'
import {
  Bitcoin2xFlexibleLeverageIndex,
  CoinDeskEthTrendIndex,
  DAI,
  DefiPulseIndex,
  DiversifiedStakedETHIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  GitcoinStakedETHIndex,
  GUSD,
  ic21,
  icETHIndex,
  IndexCoopBitcoin2xIndex,
  IndexCoopEthereum2xIndex,
  LeveragedRethStakingYield,
  MATIC,
  STETH,
  USDC,
  WETH,
} from '@/constants/tokens'

import {
  getAddressForToken,
  getCurrencyTokens,
  getCurrencyTokensForIndex,
  getNativeToken,
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
    expect(currencyTokens).toEqual(currencies)
  })
})

describe('getCurrencyTokensForIndex()', () => {
  test('returns default currency tokens', async () => {
    const chainId = 1
    const token = DefiPulseIndex
    const defaultTokens = getCurrencyTokens(chainId)
    const currencyTokens = getCurrencyTokensForIndex(token, chainId)
    expect(currencyTokens.length).toEqual(defaultTokens.length)
    expect(currencyTokens).toEqual(defaultTokens)
  })

  test('returns correct currency tokens for BTC2x-FLI', async () => {
    const chainId = 1
    const token = Bitcoin2xFlexibleLeverageIndex
    const requiredTokens = [
      IndexCoopBitcoin2xIndex,
      ...getCurrencyTokens(chainId),
    ]
    const currencyTokens = getCurrencyTokensForIndex(token, chainId)
    expect(currencyTokens.length).toEqual(requiredTokens.length)
    for (const requiredToken of requiredTokens) {
      expect(
        currencyTokens.filter(
          (currency) => currency.symbol === requiredToken.symbol,
        ).length,
      ).toEqual(1)
    }
  })

  test('returns correct tokens for cdETI', async () => {
    const chainId = 1
    const token = CoinDeskEthTrendIndex
    const currencyTokens = getCurrencyTokensForIndex(token, chainId)
    expect(currencyTokens.length).toEqual(5)
    expect(currencyTokens).toEqual([ETH, WETH, USDC, DAI, GUSD])
  })

  test('returns correct currency tokens for ic21', async () => {
    const chainId = 1
    const token = ic21
    const currencyTokens = getCurrencyTokensForIndex(token, chainId)
    expect(currencyTokens.length).toEqual(currencies.length)
    expect(currencyTokens).toEqual(currencies)
  })

  test('returns correct currency tokens for icETH', async () => {
    const chainId = 1
    const token = icETHIndex
    const currencyTokens = getCurrencyTokensForIndex(token, chainId)
    expect(currencyTokens.length).toEqual(3)
    expect(currencyTokens).toEqual([ETH, WETH, STETH])
  })

  test('returns correct currency tokens for dsETH', async () => {
    const chainId = 1
    const token = DiversifiedStakedETHIndex
    const requiredTokens = [
      'ETH',
      'WETH',
      'stETH',
      'wstETH',
      'rETH',
      'sETH2',
      'USDC',
      'GUSD',
    ]
    const currencyTokens = getCurrencyTokensForIndex(token, chainId)
    expect(currencyTokens.length).toEqual(requiredTokens.length)
    for (const requiredToken of requiredTokens) {
      expect(
        currencyTokens.filter((currency) => currency.symbol === requiredToken)
          .length,
      ).toEqual(1)
    }
  })

  test('returns correct currency tokens for ETH2x-FLI', async () => {
    const chainId = 1
    const token = Ethereum2xFlexibleLeverageIndex
    const requiredTokens = [
      IndexCoopEthereum2xIndex,
      ...getCurrencyTokens(chainId),
    ]
    const currencyTokens = getCurrencyTokensForIndex(token, chainId)
    expect(currencyTokens.length).toEqual(requiredTokens.length)
    for (const requiredToken of requiredTokens) {
      expect(
        currencyTokens.filter(
          (currency) => currency.symbol === requiredToken.symbol,
        ).length,
      ).toEqual(1)
    }
  })

  test('returns correct currency tokens for icRETH', async () => {
    const chainId = 1
    const token = LeveragedRethStakingYield
    const requiredTokens = ['ETH', 'WETH', 'rETH', 'USDC', 'GUSD']
    const currencyTokens = getCurrencyTokensForIndex(token, chainId)
    expect(currencyTokens.length).toEqual(requiredTokens.length)
    for (const requiredToken of requiredTokens) {
      expect(
        currencyTokens.filter((currency) => currency.symbol === requiredToken)
          .length,
      ).toEqual(1)
    }
  })

  test('returns correct currency tokens for gtcETH', async () => {
    const chainId = 1
    const token = GitcoinStakedETHIndex
    const requiredTokens = [
      'ETH',
      'WETH',
      'stETH',
      'wstETH',
      'rETH',
      'sETH2',
      'USDC',
      'GUSD',
    ]
    const currencyTokens = getCurrencyTokensForIndex(token, chainId)
    expect(currencyTokens.length).toEqual(requiredTokens.length)
    for (const requiredToken of requiredTokens) {
      expect(
        currencyTokens.filter((currency) => currency.symbol === requiredToken)
          .length,
      ).toEqual(1)
    }
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
