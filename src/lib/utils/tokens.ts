import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { base } from 'viem/chains'

import { ARBITRUM, BASE, MAINNET, OPTIMISM, POLYGON } from '@/constants/chains'
import { currencies } from '@/constants/tokenlists'
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
