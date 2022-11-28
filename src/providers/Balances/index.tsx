import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { BigNumber, Contract, utils } from 'ethers'

import { JsonRpcProvider } from '@ethersproject/providers'

import tokenList, { currencies, Token } from 'constants/tokens'
import { useAllReadOnlyProviders } from 'hooks/useReadOnlyProvider'
import { useWallet } from 'hooks/useWallet'
import { useMarketData } from 'providers/MarketData'
import { ERC20_ABI } from 'utils/abi/ERC20'

import { BalancesProvider } from './BalancesProvider'

export interface BalanceValues {
  token: Token
  mainnetBalance: BigNumber | null
  polygonBalance: BigNumber | null
  optimismBalance: BigNumber | null
  price: number
}

export interface TokenContext {
  getTokenBalance: (symbol: string, chainId: number | undefined) => BigNumber
  isLoading: boolean
  tokenBalances: { [key: string]: BalanceValues }
}

const ERC20Interface = new utils.Interface(ERC20_ABI)

export type TokenContextKeys = keyof TokenContext

export const BalanceContext = createContext<TokenContext>({
  getTokenBalance: () => BigNumber.from(0),
  isLoading: true,
  tokenBalances: {},
})

export const useBalanceData = () => useContext(BalanceContext)

const getBalance = async (
  address: string,
  tokenAddress: string | undefined,
  provider: JsonRpcProvider
): Promise<BigNumber | null> => {
  if (!tokenAddress) return null
  const contract = new Contract(tokenAddress, ERC20Interface, provider)
  const bal = await contract.balanceOf(address)
  return bal
}

export const BalanceProvider = (props: { children: any }) => {
  const { address } = useWallet()
  const { selectLatestMarketData, selectMarketDataByToken } = useMarketData()
  const {
    mainnetReadOnlyProvider,
    optimismReadOnlyProvider,
    polygonReadOnlyProvider,
  } = useAllReadOnlyProviders()
  const [tokenBalances, setTokenBalances] = useState<{
    [key: string]: BalanceValues
  }>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchBalanceData = useCallback(async () => {
    if (!address) return
    let balanceData: BalanceValues[] = []
    setIsLoading(true)
    const provider = new BalancesProvider(address, {
      mainnet: mainnetReadOnlyProvider,
      optimism: optimismReadOnlyProvider,
      polygon: polygonReadOnlyProvider,
    })
    await Promise.allSettled(
      tokenList.map(async (token) => {
        const { mainnetBalance, optimismBalance, polygonBalance } =
          await provider.fetchAllBalances(token)
        if (
          (mainnetBalance && !mainnetBalance.isZero()) ||
          (polygonBalance && !polygonBalance.isZero()) ||
          (optimismBalance && !optimismBalance.isZero())
        ) {
          const marketData = selectMarketDataByToken(token)
          const price = selectLatestMarketData(marketData)
          balanceData.push({
            token,
            mainnetBalance,
            polygonBalance,
            optimismBalance,
            price,
          })
        }
      })
    )
    setIsLoading(false)
    let balances = tokenBalances
    balanceData.forEach((balance: BalanceValues) => {
      balances[balance.token.symbol] = balance
    })
    setTokenBalances(balances)
  }, [address, selectLatestMarketData, selectMarketDataByToken])

  const fetchCurrencies = useCallback(async () => {
    if (!address) return
    let balanceData: BalanceValues[] = []
    const provider = new BalancesProvider(address, {
      mainnet: mainnetReadOnlyProvider,
      optimism: optimismReadOnlyProvider,
      polygon: polygonReadOnlyProvider,
    })
    await Promise.allSettled(
      currencies.map(async (token) => {
        const { mainnetBalance, optimismBalance, polygonBalance } =
          await provider.fetchAllBalances(token)
        if (
          (mainnetBalance && !mainnetBalance.isZero()) ||
          (polygonBalance && !polygonBalance.isZero()) ||
          (optimismBalance && !optimismBalance.isZero())
        ) {
          const price = 0
          balanceData.push({
            token,
            mainnetBalance,
            polygonBalance,
            optimismBalance,
            price,
          })
        }
      })
    )
    let balances = tokenBalances
    balanceData.forEach((balance: BalanceValues) => {
      balances[balance.token.symbol] = balance
    })
    setTokenBalances(balances)
  }, [address])

  const fetchNativeCurrencies = useCallback(async () => {
    if (!address) return
    const provider = new BalancesProvider(address, {
      mainnet: mainnetReadOnlyProvider,
      optimism: optimismReadOnlyProvider,
      polygon: polygonReadOnlyProvider,
    })
    const { eth, matic } = await provider.fetchNativeBalances()
    let balances = tokenBalances
    balances['ETH'] = eth
    balances['MATIC'] = matic
    setTokenBalances(balances)
  }, [address])

  useEffect(() => {
    if (!address || address === undefined) return
    fetchBalanceData()
  }, [fetchBalanceData])

  useEffect(() => {
    if (!address || address === undefined) return
    fetchCurrencies()
  }, [fetchCurrencies])

  useEffect(() => {
    if (!address || address === undefined) return
    fetchNativeCurrencies()
  }, [fetchNativeCurrencies])

  const getTokenBalance = useCallback(
    (symbol: string, chainId: number | undefined): BigNumber => {
      const tokenBalance = tokenBalances[symbol]
      switch (chainId) {
        case 1:
          return tokenBalance?.mainnetBalance ?? BigNumber.from(0)
        case 10:
          return tokenBalance?.optimismBalance ?? BigNumber.from(0)
        case 137:
          return tokenBalance?.polygonBalance ?? BigNumber.from(0)
        default:
          // FIXME: return null or BigNumber?
          return BigNumber.from(0)
      }
    },
    [tokenBalances]
  )

  return (
    <BalanceContext.Provider
      value={{
        getTokenBalance,
        isLoading,
        tokenBalances,
      }}
    >
      {props.children}
    </BalanceContext.Provider>
  )
}
