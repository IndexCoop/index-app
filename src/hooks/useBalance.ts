import { useCallback, useEffect, useMemo, useState } from 'react'

import { BigNumber, Contract, providers, utils } from 'ethers'
import { useNetwork } from 'wagmi'

import {
  dpi2020StakingRewardsAddress,
  dpi2021StakingRewardsAddress,
  gmiStakingRewardsAddress,
  mviStakingRewardsAddress,
  uniswapEthDpiLpTokenAddress,
  uniswapEthMviLpTokenAddress,
} from 'constants/ethContractAddresses'
import { GmiIndex, Token } from 'constants/tokens'
import { ERC20_ABI } from 'utils/abi/ERC20'
import StakeRewardsABI from 'utils/abi/StakingRewards.json'
import { getAddressForToken, getIndexes } from 'utils/tokens'

import { useEthBalance } from './useEthBalance'
import { useWallet } from './useWallet'

/* Returns balance of ERC20 token */
async function balanceOf(
  token: Token,
  chainId: number,
  account: string,
  library: any | undefined
): Promise<BigNumber> {
  const tokenAddress = getAddressForToken(token, chainId)
  if (!tokenAddress) return BigNumber.from(0)
  console.log('balanceOf')
  const erc20 = new Contract(tokenAddress, ERC20_ABI, library)
  const balance = await erc20.balanceOf(account)
  return balance
}

/* Returns balance of ERC20 token address*/
async function balanceOfAddress(
  tokenAddress: string,
  account: string,
  library: any | undefined
): Promise<BigNumber> {
  console.log('balanceOf')
  const erc20 = new Contract(tokenAddress, ERC20_ABI, library)
  const balance = await erc20.balanceOf(account)
  return balance
}

type IBalances = Record<string, BigNumber>

export const useBalances = () => {
  const [balances, setBalances] = useState<IBalances>({})

  const { address, provider } = useWallet()
  const { chain } = useNetwork()
  const chainId = chain?.id ?? 1

  const ethBalance = useEthBalance(chainId)
  console.log('eth', ethBalance.toString())

  useEffect(() => {
    const fetchAllBalances = async () => {
      if (!chainId || !address) return
      console.log('fetchAllBalances')
      const indexes = getIndexes(chainId)
      console.log(indexes.length, 'indexes')
      const promises = indexes.map((index) =>
        balanceOf(index, chainId, address, provider)
      )
      const results = await Promise.all(promises)
      console.log(results)
      let balances: IBalances = {}
      indexes.forEach((index, idx) => {
        balances[index.symbol] = results[idx] ?? BigNumber.from(0)
      })
      setBalances(balances)
    }

    fetchAllBalances()
  }, [address, chainId])

  const getBalance = (symbol: string): BigNumber => {
    return balances[symbol] ?? BigNumber.from(0)
  }

  return { ethBalance, getBalance }
}

// Liquidity Mining Program
// Everything below can be delete once the program is sunset.

export type StakingBalances = {
  gmiBalance?: BigNumber
  stakedGmi2022Balance?: BigNumber
  stakedUniswapEthDpi2020LpBalance?: BigNumber
  stakedUniswapEthDpi2021LpBalance?: BigNumber
  stakedUniswapEthMvi2021LpBalance?: BigNumber
  uniswapEthDpiLpBalance?: BigNumber
  uniswapEthMviLpBalance?: BigNumber
  unclaimedGmi2022Balance?: BigNumber
  unclaimedUniswapEthMvi2021LpBalance?: BigNumber
  unclaimedUniswapEthDpi2020LpBalance?: BigNumber
  unclaimedUniswapEthDpi2021LpBalance?: BigNumber
}

const stakingInterface = new utils.Interface(StakeRewardsABI)

const fetchUnclaimedRewards = async (
  stakingAddress: string,
  account: string,
  provider: providers.JsonRpcProvider
) => {
  const erc20 = new Contract(stakingAddress, stakingInterface, provider)
  const unclaimed = await erc20.earned(account)
  return unclaimed
}

export const useLiquidityMiningBalances = (): StakingBalances => {
  const { chain } = useNetwork()
  const { address, provider } = useWallet()
  const chainId = chain?.id

  const [gmiBalance, setGmiBalance] = useState(BigNumber.from(0))
  const [stakedGmi2022Balance, setStakedGmi2022Balance] = useState(
    BigNumber.from(0)
  )
  const [unclaimedGmi2022Balance, setUnclaimedGmi2022Balance] = useState(
    BigNumber.from(0)
  )

  // LP Tokens
  const [uniswapEthDpiLpBalance, setUniswapEthDpiLpBalance] = useState(
    BigNumber.from(0)
  )
  const [uniswapEthMviLpBalance, setUniswapEthMviLpBalance] = useState(
    BigNumber.from(0)
  )

  // // DPI LM Program (Oct. 7th, 2020 - Dec. 6th, 2020)
  const [
    stakedUniswapEthDpi2020LpBalance,
    setStakedUniswapEthDpi2020LpBalance,
  ] = useState(BigNumber.from(0))
  const [
    unclaimedUniswapEthDpi2020LpBalance,
    setUnclaimedUniswapEthDpi2020LpBalance,
  ] = useState(BigNumber.from(0))

  // DPI LM Program ( July 13th, 2021 - August 12th, 2021)
  const [
    stakedUniswapEthDpi2021LpBalance,
    setStakedUniswapEthDpi2021LpBalance,
  ] = useState(BigNumber.from(0))
  const [
    unclaimedUniswapEthDpi2021LpBalance,
    setUnclaimedUniswapEthDpi2021LpBalance,
  ] = useState(BigNumber.from(0))

  // MVI LM Program (August 20th, 2021 - September 19th, 2021)
  const [
    stakedUniswapEthMvi2021LpBalance,
    setStakedUniswapEthMvi2021LpBalance,
  ] = useState(BigNumber.from(0))
  const [
    unclaimedUniswapEthMvi2021LpBalance,
    setUnclaimedUniswapEthMvi2021LpBalance,
  ] = useState(BigNumber.from(0))

  const fetchStakingBalances = useCallback(async () => {
    if (chainId !== 1) return
    if (!address || !provider) return
    const gmiBalance = await balanceOfAddress(
      GmiIndex.address!,
      address,
      provider
    )
    const stakedGmi2022Balance = await balanceOfAddress(
      gmiStakingRewardsAddress,
      address,
      provider
    )
    const stakedUniswapEthDpi2020LpBalance = await balanceOfAddress(
      dpi2020StakingRewardsAddress,
      address,
      provider
    )
    const stakedUniswapEthDpi2021LpBalance = await balanceOfAddress(
      dpi2021StakingRewardsAddress,
      address,
      provider
    )
    const stakedUniswapEthMvi2021LpBalance = await balanceOfAddress(
      mviStakingRewardsAddress,
      address,
      provider
    )
    const uniswapEthDpiLpBalance = await balanceOfAddress(
      uniswapEthDpiLpTokenAddress,
      address,
      provider
    )
    const uniswapEthMviLpBalance = await balanceOfAddress(
      uniswapEthMviLpTokenAddress,
      address,
      provider
    )
    setGmiBalance(gmiBalance)
    setStakedGmi2022Balance(stakedGmi2022Balance)
    setStakedUniswapEthDpi2020LpBalance(stakedUniswapEthDpi2020LpBalance)
    setStakedUniswapEthDpi2021LpBalance(stakedUniswapEthDpi2021LpBalance)
    setStakedUniswapEthMvi2021LpBalance(stakedUniswapEthMvi2021LpBalance)
    setUniswapEthDpiLpBalance(uniswapEthDpiLpBalance)
    setUniswapEthMviLpBalance(uniswapEthMviLpBalance)
  }, [address, chainId, provider])

  useEffect(() => {
    fetchStakingBalances()
  }, [fetchStakingBalances])

  const fetchUnclaimed = useCallback(async () => {
    if (chainId !== 1) return
    if (!address) return
    const unclaimedUniswapEthDpi2020LpBalance = await fetchUnclaimedRewards(
      dpi2020StakingRewardsAddress,
      address,
      provider
    )
    const unclaimedUniswapEthDpi2021LpBalance = await fetchUnclaimedRewards(
      dpi2021StakingRewardsAddress,
      address,
      provider
    )
    const unclaimedUniswapEthMvi2021LpBalance = await fetchUnclaimedRewards(
      mviStakingRewardsAddress,
      address,
      provider
    )
    const unclaimedGmi2022Balance = await fetchUnclaimedRewards(
      gmiStakingRewardsAddress,
      address,
      provider
    )
    setUnclaimedUniswapEthDpi2020LpBalance(unclaimedUniswapEthDpi2020LpBalance)
    setUnclaimedUniswapEthDpi2021LpBalance(unclaimedUniswapEthDpi2021LpBalance)
    setUnclaimedUniswapEthMvi2021LpBalance(unclaimedUniswapEthMvi2021LpBalance)
    setUnclaimedGmi2022Balance(unclaimedGmi2022Balance)
    console.log(
      'setUnclaimedUniswapEthDpi2020LpBalance',
      setUnclaimedUniswapEthDpi2020LpBalance.toString()
    )
  }, [address, chainId, provider])

  useEffect(() => {
    fetchUnclaimed()
  }, [fetchUnclaimed])

  console.log('GMIBAL', gmiBalance?.toString())
  console.log('stakedGmi2022Balance', stakedGmi2022Balance?.toString())

  return useMemo(
    () => ({
      gmiBalance,
      stakedGmi2022Balance,
      stakedUniswapEthDpi2020LpBalance,
      stakedUniswapEthDpi2021LpBalance,
      stakedUniswapEthMvi2021LpBalance,
      uniswapEthDpiLpBalance,
      uniswapEthMviLpBalance,
      unclaimedGmi2022Balance,
      unclaimedUniswapEthMvi2021LpBalance,
      unclaimedUniswapEthDpi2020LpBalance,
      unclaimedUniswapEthDpi2021LpBalance,
    }),
    [address]
  )
}
