import { getTokenByChainAndSymbol, isAddressEqual } from '@indexcoop/tokenlists'
import { base } from 'viem/chains'

import { ARBITRUM, BASE, MAINNET, OPTIMISM, POLYGON } from '@/constants/chains'
import {
  currencies,
  indicesTokenList,
  indicesTokenListArbitrum,
} from '@/constants/tokenlists'
import {
  ETH,
  MATIC,
  STETH,
  type Token,
  USDC,
  USDT,
  WBTC,
  WETH,
} from '@/constants/tokens'

import type { Address } from 'viem'

const cbBTC = getTokenByChainAndSymbol(base.id, 'cbBTC')

export function getAddressForToken(
  tokenSymbol: string,
  chainId: number | undefined,
): string | undefined {
  const nativeToken = getNativeToken(chainId)
  if (tokenSymbol.toLowerCase() === nativeToken?.symbol.toLowerCase())
    return nativeToken.address
  const listedToken = getTokenByChainAndSymbol(chainId, tokenSymbol)
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
    return [ETH, WETH, USDC, { ...cbBTC, image: cbBTC.logoURI }]
  }
  if (index.symbol === 'icETH') return [ETH, WETH, STETH]
  const currencyTokens = getCurrencyTokens(chainId)
  return currencyTokens
}

export function getDefaultIndex(chainId = 1): Token {
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

export function isBaseToken(
  chainId: number,
  inputToken: Address,
  outputToken: Address,
): boolean {
  if (chainId !== base.id) return false
  const eth2x = getTokenByChainAndSymbol(base.id, 'ETH2X')
  const eth3x = getTokenByChainAndSymbol(base.id, 'ETH3X')
  const isEth2x =
    isAddressEqual(inputToken, eth2x.symbol) ||
    isAddressEqual(outputToken, eth2x.symbol)
  const isEth3x =
    isAddressEqual(inputToken, eth3x.symbol) ||
    isAddressEqual(outputToken, eth3x.symbol)
  return chainId === base.id && !isEth2x && !isEth3x
}

export function digitsByAddress(address: string): number {
  if (address === getTokenByChainAndSymbol(base.id, 'icUSD').address) return 4
  return 2
}
