import {
  getIndexTokenDataByAddress,
  getTokenDataByAddress,
} from '@indexcoop/tokenlists'
import { Address, parseAbi, PublicClient } from 'viem'

import { LeveragedRethStakingYield, RETH, Token } from '@/constants/tokens'
import { isSameAddress } from '@/lib/utils'

export async function getOutputToken(
  indexToken: Address,
  publicClient: PublicClient,
): Promise<Token | null> {
  if (isSameAddress(indexToken, LeveragedRethStakingYield.address!)) {
    return RETH
  }
  const components = await publicClient.readContract({
    address: indexToken,
    abi: parseAbi(['function getComponents() view returns (address[])']),
    functionName: 'getComponents',
  })
  const component = components[0]
  const chainId = publicClient.chain?.id
  if (!chainId) return null
  // First, we have to check if it's an index token because some tokens may have
  // other indexes as components
  let outputToken = getIndexTokenDataByAddress(
    component,
    publicClient.chain?.id ?? 1,
  )
  if (!outputToken) {
    // If it's not an index token, we can assume it's a regular token
    outputToken = getTokenDataByAddress(component, chainId)
  }
  if (!outputToken) return null
  return {
    ...outputToken,
    image: outputToken.logoURI,
    // all the properties below will be irrelevant for the legacy redemption
    coingeckoId: '',
    fees: { streamingFee: '0' },
    indexTypes: [],
    isDangerous: false,
    url: '',
  }
}
