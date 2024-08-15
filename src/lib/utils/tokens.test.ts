import { currencies } from '@/constants/tokenlists'
import {
  BedIndex,
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
  IndexToken,
  LeveragedRethStakingYield,
  MATIC,
  MetaverseIndex,
  STETH,
  USDC,
  WETH,
} from '@/constants/tokens'

import {
  getAddressForToken,
  getCurrencyTokens,
  getCurrencyTokensForIndex,
  getNativeToken,
  isAvailableForFlashMint,
  isAvailableForSwap,
  isLeveragedToken,
} from './tokens'

describe('isAvailableForFlashMint()', () => {
  test('returns true by default', async () => {
    const isAvailable = isAvailableForFlashMint(CoinDeskEthTrendIndex)
    expect(isAvailable).toBe(true)
  })

  test('should return false for ic21 swap availability', async () => {
    const isAvailable = isAvailableForFlashMint(ic21)
    expect(isAvailable).toBe(false)
  })

  test('should return false for INDEX swap availability', async () => {
    const isAvailable = isAvailableForFlashMint(IndexToken)
    expect(isAvailable).toBe(false)
  })
})

describe('isAvailableForSwap()', () => {
  test('returns true by default', async () => {
    const isAvailable = isAvailableForFlashMint(DefiPulseIndex)
    expect(isAvailable).toBe(true)
  })

  test('should return false for BTC2x swap availability', async () => {
    const isAvailable = isAvailableForSwap(IndexCoopBitcoin2xIndex)
    expect(isAvailable).toBe(false)
  })

  test('should return false for cdETI swap availability', async () => {
    const isAvailable = isAvailableForSwap(CoinDeskEthTrendIndex)
    expect(isAvailable).toBe(false)
  })

  test('should return false for ETH2x swap availability', async () => {
    const isAvailable = isAvailableForSwap(IndexCoopEthereum2xIndex)
    expect(isAvailable).toBe(true)
  })

  test('should return false for icRETH swap availability', async () => {
    const isAvailable = isAvailableForSwap(LeveragedRethStakingYield)
    expect(isAvailable).toBe(false)
  })
})

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
    expect(currencyTokens.length).toEqual(1)
    expect(currencyTokens).toEqual([WETH])
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
