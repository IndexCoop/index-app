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
  }
  ethPrice: number
}

export async function getGasLimit(
  transaction: QuoteTransaction,
  defaultGasEstimate: bigint,
): Promise<GasLimitResponse> {
  const { chainId } = transaction
  const eth = getNativeToken(chainId)
  const publicClient = getPublicClient(config, { chainId })
  if (!eth) {
    throw new Error(
      `Error determining gas limit: no native token for chainId: ${chainId}`,
    )
  }
  if (!publicClient) {
    throw new Error(
      `Error determining gas limit: no public client for chainId: ${chainId}`,
    )
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
    },
    ethPrice,
  }
}
