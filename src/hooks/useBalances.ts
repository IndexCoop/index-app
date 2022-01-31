import { ChainId, useEthers, useTokenBalance } from '@usedapp/core'

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
import { MAINNET_CHAIN_DATA, POLYGON_CHAIN_DATA } from 'utils/connectors'

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

export const useBalances = () => {
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
  // DPI LM Program ( July 13th, 2021 - August 12th, 2021)
  const stakedUniswapEthDpi2021LpBalance = useTokenBalance(
    dpi2021StakingRewardsAddress,
    account
  )
  // MVI LM Program (August 20th, 2021 - September 19th, 2021)
  const stakedUniswapEthMvi2021LpBalance = useTokenBalance(
    mviStakingRewardsAddress,
    account
  )
  // GMI LM Program (Jan. 10th, 2022 - Mar. 10th, 2022)
  const stakedGmi2022Balance = useTokenBalance(
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
  }
}
