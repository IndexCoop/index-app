import { getPublicClient } from '@wagmi/core'

import { QuoteTransaction } from '@/lib/hooks/use-best-quote/types'
import { getTokenPrice } from '@/lib/hooks/use-token-price'
import { getGasCostsInUsd } from '@/lib/utils/costs'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'
import { getNativeToken } from '@/lib/utils/tokens'
import { config } from '@/lib/utils/wagmi'

interface GasLimitResponse {
  gas: {
    limit: bigint
    costs: bigint
    costsUsd: number
    price: bigint
    priceEth: number
  }
}

export async function getGasLimit(
  transaction: QuoteTransaction,
  defaultGasEstimate: bigint,
): Promise<GasLimitResponse | null> {
  const { chainId } = transaction
  const publicClient = getPublicClient(config, { chainId })
  if (!publicClient) {
    console.warn('No public client for chainId:', chainId)
    return null
  }
  const eth = getNativeToken(chainId)
  if (!eth) {
    console.warn('No native token for chainId:', chainId)
    return null
  }
  const ethPrice = await getTokenPrice(eth, chainId)
  const gasPrice = await publicClient.getGasPrice()
  const gasEstimatooor = new GasEstimatooor(publicClient, defaultGasEstimate)
  // We don't want this function to fail for estimates here.
  // A default will be returned if the tx would fail.
  const canFail = false
  const gasEstimate = await gasEstimatooor.estimate(transaction, canFail)
  const costs = gasEstimate * gasPrice
  const costsUsd = getGasCostsInUsd(costs, ethPrice)
  return {
    gas: {
      limit: gasEstimate,
      costs,
      costsUsd,
      price: gasPrice,
      priceEth: ethPrice,
    },
  }
}
