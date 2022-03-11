import { ChainId } from '@usedapp/core'

import {
  basicIssuanceModuleAddress,
  basicIssuanceModulePolygonAddress,
  debtIssuanceModuleAddress,
  debtIssuanceModuleV2PolygonAddress,
} from 'constants/ethContractAddresses'
import {
  Bitcoin2xFlexibleLeverageIndex,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  GmiIndex,
  IEthereumFLIP,
  IMaticFLIP,
  Matic2xFLIP,
} from 'constants/tokens'

function getEthIssuanceModuleAddress(tokenSymbol: string) {
  switch (tokenSymbol) {
    case Bitcoin2xFlexibleLeverageIndex.symbol:
    case Ethereum2xFlexibleLeverageIndex.symbol:
    case GmiIndex.symbol:
      return debtIssuanceModuleAddress
    default:
      return basicIssuanceModuleAddress
  }
}

function getPolygonIssuanceModuleAddress(tokenSymbol: string) {
  switch (tokenSymbol) {
    case Ethereum2xFLIP.symbol:
    case IEthereumFLIP.symbol:
    case IMaticFLIP.symbol:
    case GmiIndex.symbol:
    case Matic2xFLIP.symbol:
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
