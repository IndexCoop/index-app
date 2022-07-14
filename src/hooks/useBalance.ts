import { useEffect, useState } from 'react'

import { BigNumber, Contract } from 'ethers'
import { useNetwork } from 'wagmi'

import { Token } from 'constants/tokens'
import { ERC20_ABI } from 'utils/abi/ERC20'
import { getAddressForToken, getIndexes } from 'utils/tokens'

import { useEthBalance } from './useEthBalance'
import { useWallet } from './useWallet'

// TODO: remove when mining program is fixed
export interface Balances {
  ethBalance?: BigNumber
  daiBalance?: BigNumber
  maticBalance?: BigNumber
  usdcBalance?: BigNumber
  wethBalance?: BigNumber
  dataBalance?: BigNumber
  gmiBalance?: BigNumber
  dpiBalance?: BigNumber
  mviBalance?: BigNumber
  bedBalance?: BigNumber
  btc2xFLIPBalance?: BigNumber
  iBtcFLIPBalance?: BigNumber
  icEthBalance?: BigNumber
  iEthFLIPbalance?: BigNumber
  iMaticFLIPbalance?: BigNumber
  ethFliBalance?: BigNumber
  btcFliBalance?: BigNumber
  ethFliPBalance?: BigNumber
  indexBalance?: BigNumber
  matic2xFLIPbalance?: BigNumber
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
  jpgBalance?: BigNumber
  mnyeBalance?: BigNumber
  stETHBalance?: BigNumber
}

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

  // TODO: remove when mining program is fixed
  const bal: Balances = {}
  return { balances: bal, ethBalance, getBalance }
}

//   // LP Tokens
//   // const uniswapEthDpiLpBalance = useBalance({
//   //   addressOrName: address || '',
//   //   token: uniswapEthDpiLpTokenAddress,
//   //   watch: true,
//   // }).data?.value
//   // const uniswapEthMviLpBalance = useBalance({
//   //   addressOrName: address || '',
//   //   token: uniswapEthMviLpTokenAddress,
//   //   watch: true,
//   // }).data?.value
//   //
//   // // DPI LM Program (Oct. 7th, 2020 - Dec. 6th, 2020)
//   // const stakedUniswapEthDpi2020LpBalance = useBalance({
//   //   addressOrName: address || '',
//   //   token: dpi2020StakingRewardsAddress,
//   //   watch: true,
//   // }).data?.value
//   // const unclaimedUniswapEthDpi2020LpBalance = useStakingUnclaimedRewards(
//   //   dpi2020StakingRewardsAddress,
//   //   address
//   // )
//   // // DPI LM Program ( July 13th, 2021 - August 12th, 2021)
//   // const stakedUniswapEthDpi2021LpBalance = useBalance({
//   //   addressOrName: address || '',
//   //   token: dpi2021StakingRewardsAddress,
//   //   watch: true,
//   // }).data?.value
//   // const unclaimedUniswapEthDpi2021LpBalance = useStakingUnclaimedRewards(
//   //   dpi2021StakingRewardsAddress,
//   //   address
//   // )
//   // // MVI LM Program (August 20th, 2021 - September 19th, 2021)
//   // const stakedUniswapEthMvi2021LpBalance = useBalance({
//   //   addressOrName: address || '',
//   //   token: mviStakingRewardsAddress,
//   //   watch: true,
//   // }).data?.value
//   // const unclaimedUniswapEthMvi2021LpBalance = useStakingUnclaimedRewards(
//   //   mviStakingRewardsAddress,
//   //   address
//   // )
//   // // GMI LM Program (Jan. 10th, 2022 - Mar. 10th, 2022)
//   // const stakedGmi2022Balance = useBalance({
//   //   addressOrName: address || '',
//   //   token: gmiStakingRewardsAddress,
//   //   watch: true,
//   // }).data?.value
//   // const unclaimedGmi2022Balance = useStakingUnclaimedRewards(
//   //   gmiStakingRewardsAddress,
//   //   address
//   // )
//
//     // stakedGmi2022Balance,
//     // stakedUniswapEthDpi2020LpBalance,
//     // stakedUniswapEthDpi2021LpBalance,
//     // stakedUniswapEthMvi2021LpBalance,
//     // uniswapEthDpiLpBalance,
//     // uniswapEthMviLpBalance,
//     // unclaimedGmi2022Balance,
//     // unclaimedUniswapEthMvi2021LpBalance,
//     // unclaimedUniswapEthDpi2020LpBalance,
//     // unclaimedUniswapEthDpi2021LpBalance,
//   }
