import { utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { useContractCall } from '@usedapp/core'

import StakeRewardsABI from 'utils/abi/StakingRewards.json'

const stakingInterface = new utils.Interface(StakeRewardsABI)

export const useStakingUnclaimedRewards = (
  stakingAddress?: string,
  account?: string | null
): BigNumber | undefined => {
  const [unclaimedRewards] =
    useContractCall(
      stakingAddress &&
        account && {
          abi: stakingInterface,
          address: stakingAddress,
          method: 'earned',
          args: [account],
        }
    ) ?? []
  return unclaimedRewards
}
