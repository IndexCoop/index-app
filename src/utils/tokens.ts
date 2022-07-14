import { MAINNET, OPTIMISM, POLYGON } from 'constants/chains'
import {
  ETH,
  indexNamesMainnet,
  indexNamesOptimism,
  indexNamesPolygon,
  MATIC,
  Token,
} from 'constants/tokens'

export function getAddressForToken(
  token: Token,
  chainId: number | undefined
): string | undefined {
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

export function getIndexes(chainId: number): Token[] {
  switch (chainId) {
    case MAINNET.chainId:
      return indexNamesMainnet
    case OPTIMISM.chainId:
      return indexNamesOptimism
    case POLYGON.chainId:
      return indexNamesPolygon
    default:
      return []
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
      return null
  }
}
