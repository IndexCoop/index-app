import { QuoteTransaction } from '@/lib/hooks/use-best-quote/types'
import { IndexRpcProvider } from '@/lib/hooks/use-wallet'
import { getGasCostsInUsd } from '@/lib/utils/costs'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'
import { getTokenPrice } from '@/lib/utils/token-price'
import { getNativeToken } from '@/lib/utils/tokens'
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
  publicClient: IndexRpcProvider,
): Promise<GasLimitResponse> {
  const { chainId } = transaction
  const eth = getNativeToken(chainId)
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
