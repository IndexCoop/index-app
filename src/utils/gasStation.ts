import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'

import { POLYGON } from 'constants/chains'
import { IndexApiBaseUrl } from 'constants/server'

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
 * Returns the URL for the Index Gas API.
 * Supports Polygon and Mainet only.
 * @param chainId   Chain ID (default mainnet)
 * @returns gas api URL
 */
export const getGasApiUrl = (chainId?: number): string => {
  let networkKey = ''
  switch (chainId) {
    case POLYGON.chainId:
      networkKey = 'polygon'
      break
    default:
      networkKey = 'mainnet'
  }

  return `${IndexApiBaseUrl}/gas/${networkKey}`
}

export const getMaxFeePerGas = async (chainId?: number) => {
  const url = getGasApiUrl(chainId)
  const result = await fetch(url, {
    headers: {
      Origin: 'https://app.indexcoop.com',
    },
  }).then((res) => res.json())
  return BigNumber.from(result.fast.maxFeePerGas)
}
