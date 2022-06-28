import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'

import { OPTIMISM, POLYGON } from 'constants/chains'

export class GasStation {
  provider: JsonRpcProvider
  constructor(provider: JsonRpcProvider) {
    this.provider = provider
  }

  async getGasPrice(): Promise<BigNumber> {
    const gasPrice = await this.provider.getGasPrice()
    return gasPrice
  }
}

/**
 *
 * @param chainId
 * @returns gas api URL
 */
export const getGasApiUrl = (chainId?: number): string => {
  let networkKey = ''
  switch (chainId) {
    case POLYGON.chainId:
      networkKey = 'polygon'
      break
    case OPTIMISM.chainId:
      networkKey = 'optimism'
      break
    default:
      networkKey = 'mainnet'
  }

  return `https://api.indexcoop.com/gas/${networkKey}`
}

export const getMaxFeePerGas = async (chainId?: number) => {
  const result = await fetch(getGasApiUrl(chainId)).then((res) => res.json())
  return BigNumber.from(result.fast.maxFeePerGas)
}
