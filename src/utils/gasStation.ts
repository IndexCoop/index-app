import { BigNumber } from '@ethersproject/bignumber'
import { FeeData, JsonRpcProvider } from '@ethersproject/providers'

import { POLYGON } from 'constants/chains'
import { getApiKey, IndexApiBaseUrl } from 'constants/server'

// TODO: calc gas for 0x API (from 0x vs estimateGas) // https://docs.0x.org/0x-api-swap/api-references/get-swap-v1-quote

type MaxGas = {
  maxFeePerGas: string
  maxPriorityFeePerGas: string
}

type IndexGasApiResponse = {
  fastest: MaxGas
  fast: MaxGas
  standard: MaxGas
}

export class GasStation {
  provider: JsonRpcProvider
  constructor(provider: JsonRpcProvider) {
    this.provider = provider
  }

  async getGasFees(): Promise<FeeData> {
    const feeData = await this.provider.getFeeData()
    return feeData
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
  const key = getApiKey()
  const result: IndexGasApiResponse = await fetch(url, {
    headers: {
      'X-INDEXCOOP-API-KEY': key,
    },
  }).then((res) => res.json())
  return BigNumber.from(result.fast.maxFeePerGas)
}
