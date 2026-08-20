import {
  getTokenByChainAndAddress,
  getTokenByChainAndSymbol,
  getUnderlyingToken,
  isLeverageToken,
  type ListedToken,
} from '@indexcoop/tokenlists'

/**
 * Market symbols we price and display by. Matched as substrings of the
 * underlying token's symbol so that e.g. WETH / cbBTC / uSOL map to ETH / BTC / SOL.
 */
const KNOWN_UNDERLYING_SYMBOLS = [
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
] as const

type TokenLike = {
  address?: string | null
  symbol: string
}

const matchKnownSymbol = (symbol: string) =>
  KNOWN_UNDERLYING_SYMBOLS.find((known) => symbol.includes(known))

/**
 * Resolves a token against the tokenlist for the given chain.
 * Tries the address first; if that misses, falls back to the symbol so that a token
 * object built for a different chain (e.g. the mainnet ETH2X default used while the
 * wallet is on Arbitrum) still resolves to the right chain's token.
 */
function resolveListedToken(
  chainId: number,
  token: TokenLike,
): ListedToken | null {
  const byAddress = token.address
    ? getTokenByChainAndAddress(chainId, token.address)
    : null

  if (byAddress) return byAddress

  const bySymbol = getTokenByChainAndSymbol(chainId, token.symbol)

  if (bySymbol && token.address) {
    console.warn(
      '[getUnderlyingAssetSymbol] token address not found on chain, resolved by symbol instead',
      { chainId, address: token.address, symbol: token.symbol },
    )
  }

  return bySymbol
}

/**
 * Derives the market symbol ("ETH", "BTC", "SOL", …) that is persisted as a trade's
 * `underlyingAssetSymbol` and rendered as "<symbol> / USD".
 *
 * Always upper-cased. Returns an empty string when the symbol is not in
 * KNOWN_UNDERLYING_SYMBOLS (same as before) — consumers such as the leverage history
 * route rely on '' to skip price lookups, so an unknown value must never leak through.
 * When a new market is listed, add its base asset to KNOWN_UNDERLYING_SYMBOLS.
 */
export function getUnderlyingAssetSymbol(
  chainId: number,
  token: TokenLike,
): string {
  const listed = resolveListedToken(chainId, token)

  if (isLeverageToken(listed)) {
    const underlyingSymbol = getUnderlyingToken(listed)?.symbol ?? ''
    const known = matchKnownSymbol(underlyingSymbol)

    if (!known) {
      console.warn(
        '[getUnderlyingAssetSymbol] underlying symbol is not in KNOWN_UNDERLYING_SYMBOLS',
        { chainId, symbol: listed.symbol, underlyingSymbol },
      )
    }

    return (known ?? '').toUpperCase()
  }

  return (matchKnownSymbol(listed?.symbol ?? token.symbol) ?? '').toUpperCase()
}
