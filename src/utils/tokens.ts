import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import {
  ETH,
  indexNamesMainnet,
  indexNamesOptimism,
  indexNamesPolygon,
  IndexToken,
  mainnetCurrencyTokens,
  MATIC,
  optimismCurrencyTokens,
  polygonCurrencyTokens,
  Token,
} from 'constants/tokens'

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
      return token.address
  }
}

/**
 * Gets the list of currency tokens for the selected chain.
 * @returns Token[] list of tokens
 */
export function getCurrencyTokens(chainId: number | undefined): Token[] {
  switch (chainId) {
    case MAINNET.chainId:
      return mainnetCurrencyTokens
    case OPTIMISM.chainId:
      return optimismCurrencyTokens
    case POLYGON.chainId:
      return polygonCurrencyTokens
    default:
      return mainnetCurrencyTokens
  }
}

export function getIndexes(chainId: number): Token[] {
  switch (chainId) {
    case MAINNET.chainId:
      return indexNamesMainnet
    case OPTIMISM.chainId:
      return indexNamesOptimism
    case POLYGON.chainId:
      return indexNamesPolygon
    default:
      return indexNamesMainnet
  }
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
      return ETH
  }
}
