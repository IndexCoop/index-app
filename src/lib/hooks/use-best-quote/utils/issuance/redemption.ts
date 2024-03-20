import { Address, PublicClient } from 'viem'

import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'

export class RedemptionProvider {
  constructor(
    readonly issuance: Address,
    readonly publicClient: PublicClient,
  ) {}

  async getComponentIssuanceUnits(
    tokenAddress: Address,
    issuanceAmount: bigint,
  ) {
    const data = await this.publicClient.readContract({
      address: this.issuance,
      abi: DebtIssuanceModuleV2Abi,
      functionName: 'getRequiredComponentIssuanceUnits',
      args: [tokenAddress, issuanceAmount],
    })
    return data
  }

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
