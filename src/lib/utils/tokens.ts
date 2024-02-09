import { MAINNET, OPTIMISM, POLYGON } from '@/constants/chains'
import { currencies, indicesTokenList } from '@/constants/tokenlists'
import {
  Bitcoin2xFlexibleLeverageIndex,
  CoinDeskEthTrendIndex,
  DAI,
  DiversifiedStakedETHIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  GitcoinStakedETHIndex,
  ic21,
  icETHIndex,
  IndexToken,
  LeveragedRethStakingYield,
  MATIC,
  RETH,
  SETH2,
  STETH,
  Token,
  USDC,
  WETH,
  WSTETH,
} from '@/constants/tokens'

import { isSameAddress } from '.'

export function getAddressForToken(
  token: Token,
  chainId: number | undefined
): string | undefined {
  if (token.symbol === IndexToken.symbol) return token.address
  switch (chainId) {
    case MAINNET.chainId:
      return token.address
    case OPTIMISM.chainId:
      return token.optimismAddress
    case POLYGON.chainId:
      return token.polygonAddress
    default:
      return undefined
  }
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
  chainId: number
): Token[] {
  if (index.symbol === CoinDeskEthTrendIndex.symbol)
    return [ETH, WETH, USDC, DAI]
  if (index.symbol === ic21.symbol) return [ETH, WETH]
  if (index.symbol === icETHIndex.symbol) return [ETH, WETH, STETH]
  if (
    index.symbol === DiversifiedStakedETHIndex.symbol ||
    index.symbol === GitcoinStakedETHIndex.symbol
  )
    return [ETH, WETH, USDC, RETH, STETH, SETH2, WSTETH]
  if (index.symbol === LeveragedRethStakingYield.symbol)
    return [ETH, WETH, USDC, RETH]
  const currencyTokens = getCurrencyTokens(chainId)
  return currencyTokens
}

export function getDefaultIndex(): Token {
  return indicesTokenList[0]
}

export function getNativeToken(chainId: number | undefined): Token | null {
  switch (chainId) {
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
  const indexToken = indicesTokenList.find((index) => index.symbol === symbol)
  if (indexToken) {
    return indexToken
  }
  const currencyToken = currencies.find((token) => token.symbol === symbol)
  return currencyToken ?? null
}

export function isAvailableForFlashMint(token: Token): boolean {
  switch (token.symbol) {
    case ic21.symbol:
    case IndexToken.symbol:
      return false
    default:
      return true
  }
}

export function isAvailableForSwap(token: Token): boolean {
  switch (token.symbol) {
    case CoinDeskEthTrendIndex.symbol:
    case LeveragedRethStakingYield.symbol:
      return false
    default:
      return true
  }
}

export function isIndexToken(token: Token): boolean {
  if (token.symbol === IndexToken.symbol) return false
  return indicesTokenList.some((index) =>
    isSameAddress(index.address!, token.address!)
  )
}

export function isLeveragedToken(token: Token): boolean {
  if (token === Bitcoin2xFlexibleLeverageIndex) return true
  if (token === Ethereum2xFlexibleLeverageIndex) return true
  if (token === icETHIndex) return true
  return false
}

export const isNativeCurrency = (token: Token, chainId: number): boolean => {
  const nativeCurrency = getNativeToken(chainId)
  if (!nativeCurrency) return false
  return token.symbol === nativeCurrency.symbol
}

export function isPerpToken(token: Token): boolean {
  return token.isPerp ? true : false
}
