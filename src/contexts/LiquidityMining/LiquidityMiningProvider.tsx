import { createContext, useContext, useEffect, useState } from 'react'

import { utils } from 'ethers'

import { Contract } from '@ethersproject/contracts'
import { useContractFunction, useEthers } from '@usedapp/core'

import {
  dpi2020StakingRewardsAddress,
  dpi2021StakingRewardsAddress,
  gmiStakingRewardsAddress,
  mviStakingRewardsAddress,
} from 'constants/ethContractAddresses'
import { toWei } from 'utils'
import StakeRewardsABI from 'utils/abi/StakingRewards.json'

type LiquidityMiningValues = {
  isApproved?: boolean
  isApproving?: boolean
  isPoolActive?: boolean
  onApprove?: () => void
  onStake: (amount: string) => void
  onHarvest: () => void
  onUnstakeAndHarvest: () => void
}
export type LiquidityMiningProps = {
  uniswapEthDpi2020?: LiquidityMiningValues
  uniswapEthDpi2021?: LiquidityMiningValues
  uniswapEthMvi2021?: LiquidityMiningValues
  gmi2022?: LiquidityMiningValues
  // TODO add v3 here? or is the interface too different ?
}

const LiquidityMiningContext = createContext<LiquidityMiningProps>({})

export const useLiquidityMining = () => useContext(LiquidityMiningContext)

const LiquidityMiningProvider = (props: { children: any }) => {
  const { account, library } = useEthers()

  const [uniswapEthDpi2020, setUniswapEthDpi2020] =
    useState<LiquidityMiningValues>({
      onStake: () => {},
      onHarvest: () => {},
      onUnstakeAndHarvest: () => {},
    })
  const [uniswapEthDpi2021, setUniswapEthDpi2021] =
    useState<LiquidityMiningValues>({
      onStake: () => {},
      onHarvest: () => {},
      onUnstakeAndHarvest: () => {},
    })
  const [uniswapEthMvi2021, setUniswapEthMvi2021] =
    useState<LiquidityMiningValues>({
      onStake: () => {},
      onHarvest: () => {},
      onUnstakeAndHarvest: () => {},
    })
  const [gmi2022, setGmi2022] = useState<LiquidityMiningValues>({
    onStake: () => {},
    onHarvest: () => {},
    onUnstakeAndHarvest: () => {},
  })

  if (
    !dpi2020StakingRewardsAddress ||
    !dpi2021StakingRewardsAddress ||
    !gmiStakingRewardsAddress ||
    !mviStakingRewardsAddress
  ) {
    throw new Error(
      'A token address is not defined. Please check your .env to confirm all token addresses are defined.'
    )
  }

  const stakingInterface = new utils.Interface(StakeRewardsABI)

  /**
   * DPI 2020
   */
  const dpi2020Contact = new Contract(
    dpi2020StakingRewardsAddress,
    stakingInterface
  )
  const { send: exitDpi2020 } = useContractFunction(dpi2020Contact, 'exit')

  /**
   * DPI 2021
   */
  const dpi2021Contact = new Contract(
    dpi2021StakingRewardsAddress,
    stakingInterface
  )
  const { send: exitDpi2021 } = useContractFunction(dpi2021Contact, 'exit')

  /**
   * MVI 2021
   */
  const mvi2021Contact = new Contract(
    mviStakingRewardsAddress,
    stakingInterface
  )
  const { send: exitMvi2021 } = useContractFunction(mvi2021Contact, 'exit')

  /**
   * GMI 2022
   */
  const gmiContact = new Contract(gmiStakingRewardsAddress, stakingInterface)
  const { send: stakeGmi } = useContractFunction(gmiContact, 'stake')
  const { send: claimGmi } = useContractFunction(gmiContact, 'getReward')
  const { send: exitGmi } = useContractFunction(gmiContact, 'exit')

  useEffect(() => {
    if (
      account &&
      library &&
      dpi2020StakingRewardsAddress &&
      dpi2021StakingRewardsAddress &&
      gmiStakingRewardsAddress &&
      mviStakingRewardsAddress
    ) {
      setUniswapEthDpi2020({
        onApprove: () => {},
        onStake: () => {},
        onHarvest: () => {},
        onUnstakeAndHarvest: exitDpi2020,
      })
      setUniswapEthDpi2021({
        onApprove: () => {},
        onStake: () => {},
        onHarvest: () => {},
        onUnstakeAndHarvest: exitDpi2021,
      })
      setUniswapEthMvi2021({
        onApprove: () => {},
        onStake: () => {},
        onHarvest: () => {},
        onUnstakeAndHarvest: exitMvi2021,
      })
      setGmi2022({
        onApprove: () => {},
        onStake: async (token: string) => {
          await stakeGmi(toWei(token))
        },
        onHarvest: claimGmi,
        onUnstakeAndHarvest: exitGmi,
      })
    }
  }, [account, library])

  return (
    <LiquidityMiningContext.Provider
      value={{
        uniswapEthDpi2020,
        uniswapEthDpi2021,
        uniswapEthMvi2021,
        gmi2022,
      }}
    >
      {props.children}
    </LiquidityMiningContext.Provider>
  )
}

export default LiquidityMiningProvider
