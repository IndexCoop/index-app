import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { base } from 'viem/chains'

import { ARBITRUM, BASE, MAINNET, OPTIMISM, POLYGON } from '@/constants/chains'
import {
  currencies,
  indicesTokenList,
  indicesTokenListArbitrum,
} from '@/constants/tokenlists'
import {
  CoinDeskEthTrendIndex,
  DAI,
  DiversifiedStakedETHIndex,
  ETH,
  GitcoinStakedETHIndex,
  GUSD,
  icETHIndex,
  LeveragedRethStakingYield,
  MATIC,
  RETH,
  SETH2,
  STETH,
  Token,
  USDC,
  USDT,
  WBTC,
  WETH,
  WSTETH,
} from '@/constants/tokens'

export function getAddressForToken(
  token: Token,
  chainId: number | undefined,
): string | undefined {
  const nativeToken = getNativeToken(chainId)
  if (token.symbol.toLowerCase() === nativeToken?.symbol.toLowerCase())
    return nativeToken.address
  const listedToken = getTokenByChainAndSymbol(chainId, token.symbol)
  return listedToken?.address
}

/**
 * Gets the list of currency tokens for the selected chain.
 * @returns Token[] list of tokens
 */
export function getCurrencyTokens(chainId: number | undefined): Token[] {
  switch (chainId) {
    case MAINNET.chainId:
      return currencies
    default:
      return []
  }
}

/**
 * Gets the supported currency tokens for the given index.
 * @returns Token[] list of supported currency tokens
 */
export function getCurrencyTokensForIndex(
  index: Token,
  chainId: number,
): Token[] {
  if (chainId === ARBITRUM.chainId) {
    return [ETH, WETH, WBTC, USDC, USDT]
  }
  if (chainId === BASE.chainId) {
    return [ETH, WETH, USDC]
  }
  if (index.symbol === CoinDeskEthTrendIndex.symbol)
    return [ETH, WETH, USDC, DAI, GUSD]
  if (index.symbol === icETHIndex.symbol) return [ETH, WETH, STETH]
  if (
    index.symbol === DiversifiedStakedETHIndex.symbol ||
    index.symbol === GitcoinStakedETHIndex.symbol
  )
    return [ETH, WETH, USDC, GUSD, RETH, STETH, SETH2, WSTETH]
  if (index.symbol === LeveragedRethStakingYield.symbol)
    return [ETH, WETH, USDC, GUSD, RETH]
  const currencyTokens = getCurrencyTokens(chainId)
  return currencyTokens
}

export function getDefaultIndex(chainId: number = 1): Token {
  if (chainId === ARBITRUM.chainId) return indicesTokenListArbitrum[0]
  return indicesTokenList[0]
}

export function getNativeToken(chainId: number | undefined): Token | null {
  switch (chainId) {
    case ARBITRUM.chainId:
      return ETH
    case BASE.chainId:
      return ETH
    case MAINNET.chainId:
      return ETH
    case OPTIMISM.chainId:
      return ETH
    case POLYGON.chainId:
      return MATIC
    default:
      return null
  }
}

export function getTokenBySymbol(symbol: string): Token | null {
  const indexToken = indicesTokenList.find(
    (index) => index.symbol.toLowerCase() === symbol.toLowerCase(),
  )
  if (indexToken) {
    return indexToken
  }
  const currencyToken = currencies.find(
    (token) => token.symbol.toLowerCase() === symbol.toLowerCase(),
  )
  return currencyToken ?? null
}

export function isTokenPairTradable(
  requiresProtection: boolean,
  inputTokenSymbol: string,
  outputTokenSymbol: string,
  chainId: number,
): boolean {
  if (!requiresProtection) return true
  // When tokenlists is used everywhere, we can just pass these objects as function
  // arguments instead of the token symbol
  const inputToken = getTokenByChainAndSymbol(chainId, inputTokenSymbol)
  const outputToken = getTokenByChainAndSymbol(chainId, outputTokenSymbol)
  const inputTokenIsDangerous =
    inputToken?.tags.some((tag) => tag === 'dangerous') ?? true
  const outputTokenIsDangerous =
    outputToken?.tags.some((tag) => tag === 'dangerous') ?? true
  return !inputTokenIsDangerous && !outputTokenIsDangerous
}

export function digitsByAddress(address: string): number {
  if (address === getTokenByChainAndSymbol(base.id, 'icUSD').address) return 4
  return 2
}
