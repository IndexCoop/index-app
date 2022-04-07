import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

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

type Balance = BigNumber | undefined

export interface Balances {
  ethBalance?: Balance
  daiBalance?: BigNumber
  maticBalance?: Balance
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

interface GetBalance {
  getBalance: (token: Token) => Balance
}

export const BalanceContext = createContext<GetBalance & Balances>({
  getBalance: () => BigNumber.from(0),
})

export const useBalance = () => useContext(BalanceContext)

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

export const BalanceProvider = (props: { children: any }) => {
  const { account, chainId, library } = useEthers()
  const ethBalance = useEtherBalance(account)

  const [bedBalance, setBedBalance] = useState<Balance>(BigNumber.from(0))
  const [daiBalance, setDaiBalance] = useState<Balance>(BigNumber.from(0))
  const [dataBalance, setDataBalance] = useState<Balance>(BigNumber.from(0))
  const [dpiBalance, setDpiBalance] = useState<Balance>(BigNumber.from(0))
  const [gmiBalance, setGmiBalance] = useState<Balance>(BigNumber.from(0))
  const [icEthBalance, setIcEthBalance] = useState<Balance>(BigNumber.from(0))
  const [indexBalance, setIndexBalance] = useState<Balance>(BigNumber.from(0))
  const [maticBalance, setMaticBalance] = useState<Balance>(BigNumber.from(0))
  const [mviBalance, setMviBalance] = useState<Balance>(BigNumber.from(0))
  const [usdcBalance, setUsdcBalance] = useState<Balance>(BigNumber.from(0))
  const [wethBalance, setWethBalance] = useState<Balance>(BigNumber.from(0))

  // btc2xFLIPBalance?: BigNumber
  // iBtcFLIPBalance?: BigNumber
  // icEthBalance?: BigNumber
  // iEthFLIPbalance?: BigNumber
  // iMaticFLIPbalance?: BigNumber
  // ethFliBalance?: BigNumber
  // btcFliBalance?: BigNumber
  // ethFliPBalance?: BigNumber
  // matic2xFLIPbalance?: BigNumber
  // stakedGmi2022Balance?: BigNumber

  useEffect(() => {
    if (!account || !chainId) return

    const fetchAllBalances = async () => {
      console.log('fetching...')
      const bedBalance = await balanceOf(BedIndex, chainId, account, library)
      const daiBalance = await balanceOf(DAI, chainId, account, library)
      const dataBalance = await balanceOf(DataIndex, chainId, account, library)
      const dpiBalance = await balanceOf(
        DefiPulseIndex,
        chainId,
        account,
        library
      )
      const gmiBalance = await balanceOf(GmiIndex, chainId, account, library)
      const icEthBalance = await balanceOf(
        icETHIndex,
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
      const mviBalance = await balanceOf(
        MetaverseIndex,
        chainId,
        account,
        library
      )
      const usdcBalance = await balanceOf(USDC, chainId, account, library)
      const wethBalance = await balanceOf(WETH, chainId, account, library)
      setBedBalance(bedBalance)
      setDaiBalance(daiBalance)
      setDataBalance(dataBalance)
      setDpiBalance(dpiBalance)
      setGmiBalance(gmiBalance)
      setIcEthBalance(icEthBalance)
      setIndexBalance(indexBalance)
      setMaticBalance(maticBalance)
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
        // case Bitcoin2xFlexibleLeverageIndex.symbol:
        //   return btcFliBalance
        // case Bitcoin2xFLIP.symbol:
        //   return btc2xFLIPBalance
        case DAI.symbol:
          return daiBalance
        case DataIndex.symbol:
          return dataBalance
        case DefiPulseIndex.symbol:
          return dpiBalance
        case ETH.symbol:
          return ethBalance
        // case Ethereum2xFlexibleLeverageIndex.symbol:
        //   return ethFliBalance
        // case Ethereum2xFLIP.symbol:
        //   return ethFliPBalance
        case GmiIndex.symbol:
          return gmiBalance
        // case IBitcoinFLIP.symbol:
        //   return iBtcFLIPBalance
        // case IEthereumFLIP.symbol:
        //   return iEthFLIPbalance
        // case IMaticFLIP.symbol:
        //   return iMaticFLIPbalance
        case IndexToken.symbol:
          return indexBalance
        case MATIC.symbol:
          return maticBalance
        // case Matic2xFLIP.symbol:
        //   return matic2xFLIPbalance
        case MetaverseIndex.symbol:
          return mviBalance
        case USDC.symbol:
          return usdcBalance
        case WETH.symbol:
          return wethBalance
        case icETHIndex.symbol:
          return icEthBalance
        default:
          return undefined
      }
    },
    [
      ethBalance,
      // ethFliBalance,
      // ethFliPBalance,
      bedBalance,
      // btcFliBalance,
      // btc2xFLIPBalance,
      daiBalance,
      dataBalance,
      dpiBalance,
      gmiBalance,
      icEthBalance,
      // iEthFLIPbalance,
      // iMaticFLIPbalance,
      indexBalance,
      // iBtcFLIPBalance,
      // matic2xFLIPbalance,
      maticBalance,
      mviBalance,
      usdcBalance,
      wethBalance,
    ]
  )

  return (
    <BalanceContext.Provider
      value={{
        getBalance,
        // bedBalance,
        // daiBalance,
        // dataBalance,
        // dpiBalance,
        // ethBalance,
        // gmiBalance,
        // indexBalance,
        // maticBalance,
        // mviBalance,
        // usdcBalance,
        // wethBalance,
      }}
    >
      {props.children}
    </BalanceContext.Provider>
  )
}
