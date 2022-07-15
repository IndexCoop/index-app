import { useMemo } from 'react'

import { utils } from 'ethers'
import { useContractRead } from 'wagmi'

import { BigNumber } from '@ethersproject/bignumber'

import StakeRewardsABI from 'utils/abi/StakingRewards.json'

const stakingInterface = new utils.Interface(StakeRewardsABI)

export const useStakingUnclaimedRewards = (
  stakingAddress?: string,
  account?: string | null
): BigNumber | undefined => {
  const { data, isError, isLoading } = useContractRead({
    addressOrName: stakingAddress || '',
    contractInterface: stakingInterface,
    functionName: 'earned',
    args: [account || ''],
  })

  console.log('useStakingUnclaimedRewards  data', data)
  return useMemo(() => data?.value, [stakingAddress, account])
}
