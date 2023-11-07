import { Contract, Signer } from 'ethers'

import { JsonRpcProvider } from '@ethersproject/providers'

import { OPTIMISM, POLYGON } from '@/constants/chains'
import {
  zeroExRouterAddress,
  zeroExRouterOptimismAddress,
} from '@/constants/contracts'
import { ERC20Interface } from '@/lib/utils/abi/interfaces'

export function getERC20Contract(
  address: string,
  providerOrSigner: JsonRpcProvider | Signer
): Contract {
  return new Contract(address, ERC20Interface, providerOrSigner)
}

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
