import { ChainId } from '@usedapp/core'

import {
  basicIssuanceModuleAddress,
  basicIssuanceModulePolygonAddress,
  debtIssuanceModuleAddress,
  debtIssuanceModuleV2PolygonAddress,
} from 'constants/ethContractAddresses'
import { GmiIndex } from 'constants/tokens'

// FIXME: add all cases
function getEthIssuanceModuleAddress(tokenSymbol: string) {
  switch (tokenSymbol) {
    case GmiIndex.symbol:
      return debtIssuanceModuleAddress
    default:
      return basicIssuanceModuleAddress
  }
}

// FIXME: add all cases
function getPolygonIssuanceModuleAddress(tokenSymbol: string) {
  switch (tokenSymbol) {
    case GmiIndex.symbol:
      return debtIssuanceModuleV2PolygonAddress
    default:
      return basicIssuanceModulePolygonAddress
  }
}

export function getIssuanceModule(
  tokenSymbol: string,
  chainId: ChainId = ChainId.Mainnet
) {
  return chainId === ChainId.Polygon
    ? getPolygonIssuanceModuleAddress(tokenSymbol)
    : getEthIssuanceModuleAddress(tokenSymbol)
}
