import { Address, PublicClient } from 'viem'

import { DebtIssuanceModuleAddress } from '@/constants/contracts'

import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'

export class RedemptionProvider {
  constructor(readonly publicClient: PublicClient) {}

  async getComponentRedemptionUnits(
    tokenAddress: Address,
    redeemAmount: bigint,
  ) {
    const data = await this.publicClient.readContract({
      address: DebtIssuanceModuleAddress,
      abi: DebtIssuanceModuleV2Abi,
      functionName: 'getRequiredComponentRedemptionUnits',
      args: [tokenAddress, redeemAmount],
    })
    return data
  }
}
