import { ChainId } from '@usedapp/core'

import { Token } from 'constants/tokens'

export function getAddressForToken(
  token: Token,
  chainId: ChainId | undefined
): string | undefined {
  switch (chainId) {
    case ChainId.Mainnet:
      return token.address
    case ChainId.Optimism:
      return token.optimismAddress
    case ChainId.Polygon:
      return token.polygonAddress
    default:
      return undefined
  }
}
