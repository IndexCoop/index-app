import { Address, PublicClient } from 'viem'

import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'

const DebtIssuanceModuleV2Address = '0x04b59F9F09750C044D7CfbC177561E409085f0f3'

export class RedemptionProvider {
  constructor(readonly publicClient: PublicClient) {}

  async getComponentRedemptionUnits(
    tokenAddress: Address,
    redeemAmount: bigint
  ) {
    const data = await this.publicClient.readContract({
      address: DebtIssuanceModuleV2Address,
      abi: DebtIssuanceModuleV2Abi,
      functionName: 'getRequiredComponentRedemptionUnits',
      args: [tokenAddress, redeemAmount],
      //   select: (data) => {
      //     const [addresses, amountToken] = data
      //     return addresses.map((address, idx) => ({
      //       address,
      //       amountToken: amountToken[idx],
      //       ...getTokenFromAddress(address),
      //     }))
      //   },
    })
    return data
  }
}
