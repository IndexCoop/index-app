import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'

import type { Address, PublicClient } from 'viem'

export class DebtIssuanceProvider {
  constructor(
    readonly issuance: Address,
    readonly publicClient: PublicClient,
  ) {}

  async getComponentRedemptionUnits(
    tokenAddress: Address,
    redeemAmount: bigint,
  ) {
    const data = await this.publicClient.readContract({
      address: this.issuance,
      abi: DebtIssuanceModuleV2Abi,
      functionName: 'getRequiredComponentRedemptionUnits',
      args: [tokenAddress, redeemAmount],
    })
    return data
  }
}
