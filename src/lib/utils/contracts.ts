import { OPTIMISM, POLYGON } from '@/constants/chains'
import {
  zeroExRouterAddress,
  zeroExRouterOptimismAddress,
} from '@/constants/contracts'

export const getZeroExRouterAddress = (chainId: number = 1) => {
  switch (chainId) {
    case OPTIMISM.chainId:
      return zeroExRouterOptimismAddress
    case POLYGON.chainId:
      return zeroExRouterAddress
    default:
      return zeroExRouterAddress
  }
}
