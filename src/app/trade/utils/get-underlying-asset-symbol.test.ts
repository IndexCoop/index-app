import {
  getTokenByChainAndAddress,
  getTokenByChainAndSymbol,
  getUnderlyingToken,
  isLeverageToken,
  tokenlist,
} from '@indexcoop/tokenlists'
import { arbitrum, base, mainnet } from 'viem/chains'

import { USDC } from '@/constants/tokens'

import { getUnderlyingAssetSymbol } from './get-underlying-asset-symbol'

/**
 * Verbatim copy of the derivation that lived in src/lib/utils/api/database.ts before the fix.
 * Kept here so the parity test documents exactly which behaviour was preserved.
 */
const legacyGetUnderlyingAssetSymbol = (
  chainId: number,
  address: string | undefined,
) => {
  const possible = [
    'ETH',
    'BTC',
    'SUI',
    'SOL',
    'XRP',
    'AAVE',
    'ARB',
    'LINK',
    'XAUt',
    'MATIC',
  ]

  const token = getTokenByChainAndAddress(chainId, address)

  if (isLeverageToken(token)) {
    const { symbol } = getUnderlyingToken(token)

    return possible.find((p) => symbol.includes(p)) ?? ''
  }

  return possible.find((p) => token?.symbol.includes(p)) ?? ''
}

describe('getUnderlyingAssetSymbol', () => {
  const leverageTokens = tokenlist.tokens.filter(isLeverageToken)

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('has leverage tokens to check against', () => {
    expect(leverageTokens.length).toBeGreaterThan(0)
  })

  it.each(leverageTokens.map((token) => [token.chainId, token.symbol, token]))(
    'keeps the previous result for chain %s %s',
    (_chainId, _symbol, token) => {
      const expected = legacyGetUnderlyingAssetSymbol(
        token.chainId,
        token.address,
      ).toUpperCase()

      expect(expected).not.toBe('')
      expect(getUnderlyingAssetSymbol(token.chainId, token)).toBe(expected)
    },
  )

  it('resolves a token object built for another chain by its symbol (the "/ USD" bug)', () => {
    const mainnetEth2x = getTokenByChainAndSymbol(mainnet.id, 'ETH2X')

    // The old derivation returned '' for exactly this input …
    expect(
      legacyGetUnderlyingAssetSymbol(arbitrum.id, mainnetEth2x.address),
    ).toBe('')

    // … the new one resolves ETH2X on the requested chain instead.
    expect(getUnderlyingAssetSymbol(arbitrum.id, mainnetEth2x)).toBe('ETH')
    expect(getUnderlyingAssetSymbol(base.id, mainnetEth2x)).toBe('ETH')
    expect(console.warn).toHaveBeenCalled()
  })

  it('still returns an empty string for non-leverage tokens', () => {
    expect(getUnderlyingAssetSymbol(arbitrum.id, USDC)).toBe('')
    expect(
      getUnderlyingAssetSymbol(arbitrum.id, {
        symbol: 'NOPE',
        address: '0x0000000000000000000000000000000000000001',
      }),
    ).toBe('')
  })
})
