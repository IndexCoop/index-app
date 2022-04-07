import { useCallback, useEffect, useState } from 'react'

import { BigNumber, ethers } from 'ethers'

import { ChainId, useEtherBalance, useEthers } from '@usedapp/core'

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
  MATIC,
  Matic2xFLIP,
  MetaverseIndex,
  Token,
  USDC,
  WETH,
} from 'constants/tokens'
import { getChainAddress } from 'utils'
import { ERC20_ABI } from 'utils/abi/ERC20'

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
}

/* Returns balance of ERC20 token */
async function balanceOf(
  token: Token,
  chainId: ChainId,
  account: string,
  library: ethers.providers.Web3Provider | undefined
): Promise<BigNumber> {
  const tokenAddress = getChainAddress(token, chainId)
  if (!tokenAddress) return BigNumber.from(0)
  const erc20 = new ethers.Contract(tokenAddress, ERC20_ABI, library)
  const balance = await erc20.balanceOf(account)
  return balance
}

export const useBalance = () => {
  const { account, chainId, library } = useEthers()
  const ethBalance = useEtherBalance(account)

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

  useEffect(() => {
    if (!account || !chainId) return

    const fetchAllBalances = async () => {
      console.log('fetching...')
      const bedBalance = await balanceOf(BedIndex, chainId, account, library)
      const btc2xFLIPBalance = await balanceOf(
        Bitcoin2xFLIP,
        chainId,
        account,
        library
      )
      const btcFliBalance = await balanceOf(
        Bitcoin2xFlexibleLeverageIndex,
        chainId,
        account,
        library
      )
      const daiBalance = await balanceOf(DAI, chainId, account, library)
      const dataBalance = await balanceOf(DataIndex, chainId, account, library)
      const dpiBalance = await balanceOf(
        DefiPulseIndex,
        chainId,
        account,
        library
      )
      const ethFliBalance = await balanceOf(
        Ethereum2xFlexibleLeverageIndex,
        chainId,
        account,
        library
      )
      const ethFliPBalance = await balanceOf(
        Ethereum2xFLIP,
        chainId,
        account,
        library
      )
      const gmiBalance = await balanceOf(GmiIndex, chainId, account, library)
      const iBtcFLIPBalance = await balanceOf(
        IBitcoinFLIP,
        chainId,
        account,
        library
      )
      const icEthBalance = await balanceOf(
        icETHIndex,
        chainId,
        account,
        library
      )
      const iEthFLIPbalance = await balanceOf(
        IEthereumFLIP,
        chainId,
        account,
        library
      )
      const iMaticFLIPbalance = await balanceOf(
        IMaticFLIP,
        chainId,
        account,
        library
      )
      const indexBalance = await balanceOf(
        IndexToken,
        chainId,
        account,
        library
      )
      const maticBalance = await balanceOf(MATIC, chainId, account, library)
      const matic2xFLIPbalance = await balanceOf(
        Matic2xFLIP,
        chainId,
        account,
        library
      )
      const mviBalance = await balanceOf(
        MetaverseIndex,
        chainId,
        account,
        library
      )
      const usdcBalance = await balanceOf(USDC, chainId, account, library)
      const wethBalance = await balanceOf(WETH, chainId, account, library)
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
    }

    fetchAllBalances()
  }, [account, chainId])

  const getBalance = useCallback(
    (token: Token): BigNumber | undefined => {
      switch (token.symbol) {
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
  }

  return { balances, getBalance }
}
