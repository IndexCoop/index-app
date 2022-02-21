import { utils } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import {
  ChainId,
  useContractCall,
  useEthers,
  useTokenBalance,
} from '@usedapp/core'

import {
  daiTokenAddress,
  daiTokenPolygonAddress,
  dpi2020StakingRewardsAddress,
  dpi2021StakingRewardsAddress,
  gmiStakingRewardsAddress,
  mviStakingRewardsAddress,
  uniswapEthDpiLpTokenAddress,
  uniswapEthMviLpTokenAddress,
  usdcTokenAddress,
  usdcTokenPolygonAddress,
} from 'constants/ethContractAddresses'
import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DataIndex,
  DefiPulseIndex,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  GmiIndex,
  MetaverseIndex,
  ProductToken,
} from 'constants/productTokens'
import StakeRewardsABI from 'utils/abi/StakingRewards.json'

import { MAINNET_CHAIN_DATA, POLYGON_CHAIN_DATA } from './useNetwork'

export type Balances = {
  daiBalance?: BigNumber
  usdcBalance?: BigNumber
  dpiBalance?: BigNumber
  mviBalance?: BigNumber
  bedBalance?: BigNumber
  dataBalance?: BigNumber
  gmiBalance?: BigNumber
  ethFliBalance?: BigNumber
  btcFliBalance?: BigNumber
  ethFliPBalance?: BigNumber
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

const getChainAddress = (
  token: ProductToken,
  chainId: ChainId = MAINNET_CHAIN_DATA.chainId
) => {
  if (chainId === POLYGON_CHAIN_DATA.chainId) return token.polygonAddress
  return token.address
}

const getDaiAddress = (chainId: ChainId = MAINNET_CHAIN_DATA.chainId) => {
  if (chainId === POLYGON_CHAIN_DATA.chainId) return daiTokenPolygonAddress
  return daiTokenAddress
}
const getUsdcAddress = (chainId: ChainId = MAINNET_CHAIN_DATA.chainId) => {
  if (chainId === POLYGON_CHAIN_DATA.chainId) return usdcTokenPolygonAddress
  return usdcTokenAddress
}

const stakingInterface = new utils.Interface(StakeRewardsABI)

const useStakingUnclaimedRewards = (
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

export const useBalances = (): Balances => {
  const { account, chainId } = useEthers()

  const daiBalance = useTokenBalance(getDaiAddress(chainId), account)
  const usdcBalance = useTokenBalance(getUsdcAddress(chainId), account)
  const dpiBalance = useTokenBalance(
    getChainAddress(DefiPulseIndex, chainId),
    account
  )
  const mviBalance = useTokenBalance(
    getChainAddress(MetaverseIndex, chainId),
    account
  )
  const bedBalance = useTokenBalance(
    getChainAddress(BedIndex, chainId),
    account
  )
  const dataBalance = useTokenBalance(
    getChainAddress(DataIndex, chainId),
    account
  )
  const gmiBalance = useTokenBalance(
    getChainAddress(GmiIndex, chainId),
    account
  )
  const ethFliBalance = useTokenBalance(
    getChainAddress(Ethereum2xFlexibleLeverageIndex, chainId),
    account
  )
  const btcFliBalance = useTokenBalance(
    getChainAddress(Bitcoin2xFlexibleLeverageIndex, chainId),
    account
  )
  const ethFliPBalance = useTokenBalance(
    getChainAddress(Ethereum2xFLIP, chainId),
    account
  )

  // LP Tokens
  const uniswapEthDpiLpBalance = useTokenBalance(
    uniswapEthDpiLpTokenAddress,
    account
  )
  const uniswapEthMviLpBalance = useTokenBalance(
    uniswapEthMviLpTokenAddress,
    account
  )

  // DPI LM Program (Oct. 7th, 2020 - Dec. 6th, 2020)
  const stakedUniswapEthDpi2020LpBalance = useTokenBalance(
    dpi2020StakingRewardsAddress,
    account
  )
  const unclaimedUniswapEthDpi2020LpBalance = useStakingUnclaimedRewards(
    dpi2020StakingRewardsAddress,
    account
  )
  // DPI LM Program ( July 13th, 2021 - August 12th, 2021)
  const stakedUniswapEthDpi2021LpBalance = useTokenBalance(
    dpi2021StakingRewardsAddress,
    account
  )
  const unclaimedUniswapEthDpi2021LpBalance = useStakingUnclaimedRewards(
    dpi2021StakingRewardsAddress,
    account
  )
  // MVI LM Program (August 20th, 2021 - September 19th, 2021)
  const stakedUniswapEthMvi2021LpBalance = useTokenBalance(
    mviStakingRewardsAddress,
    account
  )
  const unclaimedUniswapEthMvi2021LpBalance = useStakingUnclaimedRewards(
    mviStakingRewardsAddress,
    account
  )
  // GMI LM Program (Jan. 10th, 2022 - Mar. 10th, 2022)
  const stakedGmi2022Balance = useTokenBalance(
    gmiStakingRewardsAddress,
    account
  )
  const unclaimedGmi2022Balance = useStakingUnclaimedRewards(
    gmiStakingRewardsAddress,
    account
  )

  return {
    daiBalance,
    usdcBalance,
    dpiBalance,
    mviBalance,
    bedBalance,
    dataBalance,
    gmiBalance,
    ethFliBalance,
    btcFliBalance,
    ethFliPBalance,
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
  }
}
