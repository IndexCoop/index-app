import {
  MainnetTokens,
  MaticTokens,
  OptimismTokens,
} from '@indexcoop/tokenlists'

import { OPTIMISM, POLYGON } from 'constants/chains'

export type { TokenData } from '@indexcoop/tokenlists'

export function getTokenList(chainId: number = 1) {
  switch (chainId) {
    case POLYGON.chainId:
      return MaticTokens
    case OPTIMISM.chainId:
      return OptimismTokens
    default:
      return MainnetTokens
  }
}

export const getAllTokenLists = () => {
  return {
    mainnetTokens: MainnetTokens,
    polygonTokens: MaticTokens,
    optimismTokens: OptimismTokens,
  }
}
