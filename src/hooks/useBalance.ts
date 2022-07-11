import { useCallback, useEffect, useState } from 'react'

import { BigNumber, Contract, providers } from 'ethers'
import { useBalance, useNetwork } from 'wagmi'

import {
  dpi2020StakingRewardsAddress,
  dpi2021StakingRewardsAddress,
  gmiStakingRewardsAddress,
  mviStakingRewardsAddress,
  uniswapEthDpiLpTokenAddress,
  uniswapEthMviLpTokenAddress,
} from 'constants/ethContractAddresses'
import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  Bitcoin2xFLIP,
  DAI,
  DataIndex,
  DefiPulseIndex,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  Ethereum2xFLIP,
  GmiIndex,
  IBitcoinFLIP,
  icETHIndex,
  IEthereumFLIP,
  IMaticFLIP,
  IndexToken,
  JPGIndex,
  MATIC,
  Matic2xFLIP,
  MetaverseIndex,
  MNYeIndex,
  STETH,
  Token,
  USDC,
  WETH,
} from 'constants/tokens'
import { ERC20_ABI } from 'utils/abi/ERC20'
import { useStakingUnclaimedRewards } from 'utils/stakingRewards'
import { getAddressForToken } from 'utils/tokens'

import { useWallet } from './useWallet'

type Balance = BigNumber

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
  const erc20 = new Contract(tokenAddress, ERC20_ABI, library)
  const balance = await erc20.balanceOf(account)
  return balance
}

export const useBalances = () => {
  const { address, provider } = useWallet()
  const { chain } = useNetwork()
  const ethBalance = useBalance({
    addressOrName: address || '',
    watch: true,
  }).data?.value

  const [bedBalance, setBedBalance] = useState<Balance>(BigNumber.from(0))
  const [btc2xFLIPBalance, setBtc2xFLIPBalance] = useState<Balance>(
    BigNumber.from(0)
  )
  const [btcFliBalance, setBtcFliBalance] = useState<Balance>(BigNumber.from(0))
  const [daiBalance, setDaiBalance] = useState<Balance>(BigNumber.from(0))
  const [dataBalance, setDataBalance] = useState<Balance>(BigNumber.from(0))
  const [dpiBalance, setDpiBalance] = useState<Balance>(BigNumber.from(0))
  const [ethFliBalance, setEthFliBalance] = useState<Balance>(BigNumber.from(0))
  const [ethFliPBalance, setEthFliPBalance] = useState<Balance>(
    BigNumber.from(0)
  )
  const [gmiBalance, setGmiBalance] = useState<Balance>(BigNumber.from(0))
  const [iBtcFLIPBalance, setIBtcFLIPBalance] = useState<Balance>(
    BigNumber.from(0)
  )
  const [icEthBalance, setIcEthBalance] = useState<Balance>(BigNumber.from(0))
  const [iEthFLIPbalance, setIEthFLIPbalance] = useState<Balance>(
    BigNumber.from(0)
  )
  const [iMaticFLIPbalance, setIMaticFLIPbalance] = useState<Balance>(
    BigNumber.from(0)
  )
  const [indexBalance, setIndexBalance] = useState<Balance>(BigNumber.from(0))
  const [maticBalance, setMaticBalance] = useState<Balance>(BigNumber.from(0))
  const [matic2xFLIPbalance, setMatic2xFLIPbalance] = useState<Balance>(
    BigNumber.from(0)
  )
  const [mviBalance, setMviBalance] = useState<Balance>(BigNumber.from(0))
  const [usdcBalance, setUsdcBalance] = useState<Balance>(BigNumber.from(0))
  const [wethBalance, setWethBalance] = useState<Balance>(BigNumber.from(0))
  const [jpgBalance, setJpgBalance] = useState<Balance>(BigNumber.from(0))
  const [mnyeBalance, setMnyeBalance] = useState<Balance>(BigNumber.from(0))
  const [stETHBalance, setstETHBalance] = useState<Balance>(BigNumber.from(0))

  // LP Tokens
  const uniswapEthDpiLpBalance = useBalance({
    addressOrName: address || '',
    token: uniswapEthDpiLpTokenAddress,
    watch: true,
  }).data?.value
  const uniswapEthMviLpBalance = useBalance({
    addressOrName: address || '',
    token: uniswapEthMviLpTokenAddress,
    watch: true,
  }).data?.value

  // DPI LM Program (Oct. 7th, 2020 - Dec. 6th, 2020)
  const stakedUniswapEthDpi2020LpBalance = useBalance({
    addressOrName: address || '',
    token: dpi2020StakingRewardsAddress,
    watch: true,
  }).data?.value
  const unclaimedUniswapEthDpi2020LpBalance = useStakingUnclaimedRewards(
    dpi2020StakingRewardsAddress,
    address
  )
  // DPI LM Program ( July 13th, 2021 - August 12th, 2021)
  const stakedUniswapEthDpi2021LpBalance = useBalance({
    addressOrName: address || '',
    token: dpi2021StakingRewardsAddress,
    watch: true,
  }).data?.value
  const unclaimedUniswapEthDpi2021LpBalance = useStakingUnclaimedRewards(
    dpi2021StakingRewardsAddress,
    address
  )
  // MVI LM Program (August 20th, 2021 - September 19th, 2021)
  const stakedUniswapEthMvi2021LpBalance = useBalance({
    addressOrName: address || '',
    token: mviStakingRewardsAddress,
    watch: true,
  }).data?.value
  const unclaimedUniswapEthMvi2021LpBalance = useStakingUnclaimedRewards(
    mviStakingRewardsAddress,
    address
  )
  // GMI LM Program (Jan. 10th, 2022 - Mar. 10th, 2022)
  const stakedGmi2022Balance = useBalance({
    addressOrName: address || '',
    token: gmiStakingRewardsAddress,
    watch: true,
  }).data?.value
  const unclaimedGmi2022Balance = useStakingUnclaimedRewards(
    gmiStakingRewardsAddress,
    address
  )

  useEffect(() => {
    if (!address || !chain?.id) return

    const fetchAllBalances = async () => {
      const bedBalance = await balanceOf(BedIndex, chain?.id, address, provider)
      const btc2xFLIPBalance = await balanceOf(
        Bitcoin2xFLIP,
        chain?.id,
        address,
        provider
      )
      const btcFliBalance = await balanceOf(
        Bitcoin2xFlexibleLeverageIndex,
        chain?.id,
        address,
        provider
      )
      const daiBalance = await balanceOf(DAI, chain?.id, address, provider)
      const dataBalance = await balanceOf(
        DataIndex,
        chain?.id,
        address,
        provider
      )
      const dpiBalance = await balanceOf(
        DefiPulseIndex,
        chain?.id,
        address,
        provider
      )
      const ethFliBalance = await balanceOf(
        Ethereum2xFlexibleLeverageIndex,
        chain?.id,
        address,
        provider
      )
      const ethFliPBalance = await balanceOf(
        Ethereum2xFLIP,
        chain?.id,
        address,
        provider
      )
      const gmiBalance = await balanceOf(GmiIndex, chain?.id, address, provider)
      const iBtcFLIPBalance = await balanceOf(
        IBitcoinFLIP,
        chain?.id,
        address,
        provider
      )
      const icEthBalance = await balanceOf(
        icETHIndex,
        chain?.id,
        address,
        provider
      )
      const iEthFLIPbalance = await balanceOf(
        IEthereumFLIP,
        chain?.id,
        address,
        provider
      )
      const iMaticFLIPbalance = await balanceOf(
        IMaticFLIP,
        chain?.id,
        address,
        provider
      )
      const indexBalance = await balanceOf(
        IndexToken,
        chain?.id,
        address,
        provider
      )
      const maticBalance = await balanceOf(MATIC, chain?.id, address, provider)
      const matic2xFLIPbalance = await balanceOf(
        Matic2xFLIP,
        chain?.id,
        address,
        provider
      )
      const mviBalance = await balanceOf(
        MetaverseIndex,
        chain?.id,
        address,
        provider
      )
      const usdcBalance = await balanceOf(USDC, chain?.id, address, provider)
      const wethBalance = await balanceOf(WETH, chain?.id, address, provider)
      const jpgBalance = await balanceOf(JPGIndex, chain?.id, address, provider)
      const mnyeBalance = await balanceOf(
        MNYeIndex,
        chain?.id,
        address,
        provider
      )
      const stETHBalance = await balanceOf(STETH, chain?.id, address, provider)
      setBedBalance(bedBalance)
      setBtc2xFLIPBalance(btc2xFLIPBalance)
      setBtcFliBalance(btcFliBalance)
      setDaiBalance(daiBalance)
      setDataBalance(dataBalance)
      setDpiBalance(dpiBalance)
      setEthFliBalance(ethFliBalance)
      setEthFliPBalance(ethFliPBalance)
      setGmiBalance(gmiBalance)
      setIBtcFLIPBalance(iBtcFLIPBalance)
      setIcEthBalance(icEthBalance)
      setIEthFLIPbalance(iEthFLIPbalance)
      setIMaticFLIPbalance(iMaticFLIPbalance)
      setIndexBalance(indexBalance)
      setMaticBalance(maticBalance)
      setMatic2xFLIPbalance(matic2xFLIPbalance)
      setMviBalance(mviBalance)
      setUsdcBalance(usdcBalance)
      setWethBalance(wethBalance)
      setJpgBalance(jpgBalance)
      setMnyeBalance(mnyeBalance)
      setstETHBalance(stETHBalance)
    }

    fetchAllBalances()
  }, [address, chain?.id])

  const getBalance = useCallback(
    (tokenSymbol: string): BigNumber | undefined => {
      switch (tokenSymbol) {
        case BedIndex.symbol:
          return bedBalance
        case Bitcoin2xFlexibleLeverageIndex.symbol:
          return btcFliBalance
        case Bitcoin2xFLIP.symbol:
          return btc2xFLIPBalance
        case DAI.symbol:
          return daiBalance
        case DataIndex.symbol:
          return dataBalance
        case DefiPulseIndex.symbol:
          return dpiBalance
        case ETH.symbol:
          return ethBalance
        case Ethereum2xFlexibleLeverageIndex.symbol:
          return ethFliBalance
        case Ethereum2xFLIP.symbol:
          return ethFliPBalance
        case GmiIndex.symbol:
          return gmiBalance
        case IBitcoinFLIP.symbol:
          return iBtcFLIPBalance
        case icETHIndex.symbol:
          return icEthBalance
        case IEthereumFLIP.symbol:
          return iEthFLIPbalance
        case IMaticFLIP.symbol:
          return iMaticFLIPbalance
        case IndexToken.symbol:
          return indexBalance
        case MATIC.symbol:
          return maticBalance
        case Matic2xFLIP.symbol:
          return matic2xFLIPbalance
        case MetaverseIndex.symbol:
          return mviBalance
        case USDC.symbol:
          return usdcBalance
        case WETH.symbol:
          return wethBalance
        case JPGIndex.symbol:
          return jpgBalance
        case MNYeIndex.symbol:
          return mnyeBalance
        case STETH.symbol:
          return stETHBalance
        default:
          return undefined
      }
    },
    [
      bedBalance,
      btc2xFLIPBalance,
      btcFliBalance,
      daiBalance,
      dataBalance,
      dpiBalance,
      ethBalance,
      ethFliBalance,
      ethFliPBalance,
      gmiBalance,
      iBtcFLIPBalance,
      icEthBalance,
      iEthFLIPbalance,
      iMaticFLIPbalance,
      indexBalance,
      matic2xFLIPbalance,
      maticBalance,
      mviBalance,
      usdcBalance,
      wethBalance,
      jpgBalance,
      mnyeBalance,
      stETHBalance,
    ]
  )

  const balances = {
    bedBalance,
    btc2xFLIPBalance,
    btcFliBalance,
    daiBalance,
    dataBalance,
    dpiBalance,
    ethBalance,
    ethFliBalance,
    ethFliPBalance,
    gmiBalance,
    iBtcFLIPBalance,
    icEthBalance,
    iEthFLIPbalance,
    iMaticFLIPbalance,
    indexBalance,
    matic2xFLIPbalance,
    maticBalance,
    mviBalance,
    usdcBalance,
    wethBalance,
    jpgBalance,
    mnyeBalance,
    stETHBalance,
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

  return { balances, getBalance }
}
