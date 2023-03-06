import {
  DAI,
  DefiPulseIndex,
  DiversifiedStakedETHIndex,
  ETH,
  FIXED_DAI,
  FIXED_USDC,
  flashMintIndexesMainnetRedeem,
  flashMintIndexesPolygonRedeem,
  GitcoinStakedETHIndex,
  icETHIndex,
  indexNamesMainnet,
  indexNamesPolygon,
  STETH,
  USDC,
} from 'constants/tokens'
import { getCurrencyTokens } from 'utils/tokens'

import {
  getCurrencyTokensForToken,
  getTokenListByChain,
} from './useTradeTokenLists'

describe('getCurrencyTokensForToken()', () => {
  test('returns default currency tokens', async () => {
    const chainId = 1
    const token = DefiPulseIndex
    const defaultTokens = getCurrencyTokens(chainId)
    const currencyTokens = getCurrencyTokensForToken(token, chainId)
    expect(currencyTokens.length).toEqual(defaultTokens.length)
    expect(currencyTokens).toEqual(defaultTokens)
  })

  test('returns DAI only for FIXED-DAI', async () => {
    const chainId = 1
    const token = FIXED_DAI
    const currencyTokens = getCurrencyTokensForToken(token, chainId)
    expect(currencyTokens.length).toEqual(1)
    expect(currencyTokens).toEqual([DAI])
  })

  test('returns USDC only for FIXED-USDC', async () => {
    const chainId = 1
    const token = FIXED_USDC
    const currencyTokens = getCurrencyTokensForToken(token, chainId)
    expect(currencyTokens.length).toEqual(1)
    expect(currencyTokens).toEqual([USDC])
  })

  test('returns correct currency tokens for icETH', async () => {
    const chainId = 1
    const token = icETHIndex
    const currencyTokens = getCurrencyTokensForToken(token, chainId)
    expect(currencyTokens.length).toEqual(2)
    expect(currencyTokens).toEqual([ETH, STETH])
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
    ]
    const currencyTokens = getCurrencyTokensForToken(token, chainId)
    expect(currencyTokens.length).toEqual(requiredTokens.length)
    for (let requiredToken of requiredTokens) {
      expect(
        currencyTokens.filter((currency) => currency.symbol === requiredToken)
          .length
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
    ]
    const currencyTokens = getCurrencyTokensForToken(token, chainId)
    expect(currencyTokens.length).toEqual(requiredTokens.length)
    for (let requiredToken of requiredTokens) {
      expect(
        currencyTokens.filter((currency) => currency.symbol === requiredToken)
          .length
      ).toEqual(1)
    }
  })
})

describe('getTokenListByChain()', () => {
  test('returns single token for single token', async () => {
    const chainId = 1
    const isFlashMint = false
    const singleToken = DefiPulseIndex
    const list = getTokenListByChain(chainId, isFlashMint, singleToken)
    expect(list.length).toBe(1)
    expect(list[0]).toBe(DefiPulseIndex)
  })

  test('returns regular list for swap on mainnet', async () => {
    const chainId = 1
    const isFlashMint = false
    const singleToken = undefined
    const list = getTokenListByChain(chainId, isFlashMint, singleToken)
    expect(list).toEqual(indexNamesMainnet)
  })

  test('returns redeem list for flash mint on mainnet', async () => {
    const chainId = 1
    const isFlashMint = true
    const singleToken = undefined
    const list = getTokenListByChain(chainId, isFlashMint, singleToken)
    expect(list).toEqual(flashMintIndexesMainnetRedeem)
  })

  test('returns regular list for swap on polygon', async () => {
    const chainId = 137
    const isFlashMint = false
    const singleToken = undefined
    const list = getTokenListByChain(chainId, isFlashMint, singleToken)
    expect(list).toEqual(indexNamesPolygon)
  })

  test('returns specific list for flash mint on polygon', async () => {
    const chainId = 137
    const isFlashMint = true
    const singleToken = undefined
    const list = getTokenListByChain(chainId, isFlashMint, singleToken)
    expect(list).toEqual(flashMintIndexesPolygonRedeem)
  })
})
