import { getTokenByChainAndSymbol, isAddressEqual } from '@indexcoop/tokenlists'
import { Address } from 'viem'
import { base } from 'viem/chains'

import { ARBITRUM, BASE, MAINNET, OPTIMISM, POLYGON } from '@/constants/chains'
import {
  currencies,
  indicesTokenList,
  indicesTokenListArbitrum,
  indicesTokenListBase,
} from '@/constants/tokenlists'
import {
  CoinDeskEthTrendIndex,
  DAI,
  ETH,
  GUSD,
  MATIC,
  STETH,
  Token,
  USDC,
  USDT,
  WBTC,
  WETH,
  icETHIndex,
} from '@/constants/tokens'

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
  if (index.symbol === CoinDeskEthTrendIndex.symbol)
    return [ETH, WETH, USDC, DAI, GUSD]
  if (index.symbol === icETHIndex.symbol) return [ETH, WETH, STETH]
  const currencyTokens = getCurrencyTokens(chainId)
  return currencyTokens
}

export function getDefaultIndex(chainId: number = 1): Token {
  if (chainId === ARBITRUM.chainId) return indicesTokenListArbitrum[0]
  if (chainId === BASE.chainId) return indicesTokenListBase[0]
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

export function isTokenBtcOnBase(
  chainId: number,
  inputToken: Address,
  outputToken: Address,
): boolean {
  if (chainId !== base.id) return false
  const btc2x = getTokenByChainAndSymbol(base.id, 'BTC2X')
  const btc3x = getTokenByChainAndSymbol(base.id, 'BTC3X')
  return (
    isAddressEqual(inputToken, btc2x.address) ||
    isAddressEqual(inputToken, btc3x.address) ||
    isAddressEqual(outputToken, btc2x.address) ||
    isAddressEqual(outputToken, btc3x.address)
  )
}

export function digitsByAddress(address: string): number {
  if (address === getTokenByChainAndSymbol(base.id, 'icUSD').address) return 4
  return 2
}
