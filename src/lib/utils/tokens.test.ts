import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'

import { currencies } from '@/constants/tokenlists'
import { ETH, MATIC, STETH, WETH } from '@/constants/tokens'

import {
  getAddressForToken,
  getCurrencyTokens,
  getCurrencyTokensForIndex,
  getNativeToken,
} from './tokens'

describe('getAddressForToken()', () => {
  test('should return undefined for undefined chain', async () => {
    const address = getAddressForToken('WETH', undefined)
    expect(address).toBeUndefined()
  })

  test('should return undefined for unsupported chain', async () => {
    const address = getAddressForToken('ETH', 56)
    expect(address).toBeUndefined()
  })

  test('should return correct token address for ETH on Ethereum', async () => {
    const address = getAddressForToken('ETH', 1)
    expect(address).toBeDefined()
    expect(address).toEqual(ETH.address)
  })

  test('should return correct token address for WETH on Ethereum', async () => {
    const address = getAddressForToken('WETH', 1)
    expect(address).toBeDefined()
    expect(address).toEqual(WETH.address)
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
    const dpi = getTokenByChainAndSymbol(chainId, 'DPI')
    const token = { ...dpi, image: dpi.logoURI }
    const defaultTokens = getCurrencyTokens(chainId)
    const currencyTokens = getCurrencyTokensForIndex(token, chainId)
    expect(currencyTokens.length).toEqual(defaultTokens.length)
    expect(currencyTokens).toEqual(defaultTokens)
  })

  test('returns correct currency tokens for icETH', async () => {
    const chainId = 1
    const indexToken = getTokenByChainAndSymbol(chainId, 'icETH')
    const token = { ...indexToken, image: indexToken.logoURI }
    const currencyTokens = getCurrencyTokensForIndex(token, chainId)
    expect(currencyTokens.length).toEqual(3)
    expect(currencyTokens).toEqual([ETH, WETH, STETH])
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
