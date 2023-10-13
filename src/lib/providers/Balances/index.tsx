import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { BigNumber } from 'ethers'

import tokenList, { currencies } from '../../../constants/tokenlists'
import { Token } from '../../../constants/tokens'
import { useAllReadOnlyProviders } from '../../../lib/hooks/useReadOnlyProvider'
import { useWallet } from '../../../lib/hooks/useWallet'

import { BalancesProvider } from './BalancesProvider'

export interface BalanceValues {
  token: Token
  mainnetBalance: BigNumber | null
  polygonBalance: BigNumber | null
  optimismBalance: BigNumber | null
  price: number
}

type Balances = { [key: string]: BalanceValues }

export interface TokenContext {
  getTokenBalance: (symbol: string, chainId: number | undefined) => BigNumber
  isLoading: boolean
  tokenBalances: Balances
}

export const BalanceContext = createContext<TokenContext>({
  getTokenBalance: () => BigNumber.from(0),
  isLoading: true,
  tokenBalances: {},
})

export const useBalanceData = () => useContext(BalanceContext)

export const BalanceProvider = (props: { children: any }) => {
  const { address } = useWallet()
  const {
    mainnetReadOnlyProvider,
    optimismReadOnlyProvider,
    polygonReadOnlyProvider,
  } = useAllReadOnlyProviders()
  const [tokenBalances, setTokenBalances] = useState<{
    [key: string]: BalanceValues
  }>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchBalanceData = async () => {
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
        if (mainnetBalance && !mainnetBalance.isZero()) {
          // Price is not used from this provider at the moment.
          // The provider and its structure will be refactored soon.
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
    let balances: Balances = {}
    balanceData.forEach((balance: BalanceValues) => {
      balances[balance.token.symbol] = balance
    })
    return balances
  }

  const fetchCurrencies = async () => {
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
        if (mainnetBalance && !mainnetBalance.isZero()) {
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
    let balances: Balances = {}
    balanceData.forEach((balance: BalanceValues) => {
      balances[balance.token.symbol] = balance
    })
    return balances
  }

  const fetchNativeCurrencies = async () => {
    if (!address) return
    const provider = new BalancesProvider(address, {
      mainnet: mainnetReadOnlyProvider,
      optimism: optimismReadOnlyProvider,
      polygon: polygonReadOnlyProvider,
    })
    const { eth, matic } = await provider.fetchNativeBalances()
    let balances: Balances = {}
    balances['ETH'] = eth
    balances['MATIC'] = matic
    return balances
  }

  const getTokenBalance = useCallback(
    (symbol: string, chainId: number | undefined): BigNumber => {
      if (!address) return BigNumber.from(0)
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
    [address, tokenBalances]
  )

  useEffect(() => {
    if (!address || address === undefined) return
    const fetchBalances = async () => {
      setIsLoading(true)
      const nativeBalances = await fetchNativeCurrencies()
      const tokenBalances = await fetchBalanceData()
      const currenciesBalances = await fetchCurrencies()
      const balances = {
        ...nativeBalances,
        ...currenciesBalances,
        ...tokenBalances,
      }
      setTokenBalances(balances)
      setIsLoading(false)
    }
    // Reset balances and fetch all in one function as otherwise there might be
    // hickups with old balances
    setTokenBalances({})
    fetchBalances()
  }, [
    address,
    mainnetReadOnlyProvider,
    optimismReadOnlyProvider,
    polygonReadOnlyProvider,
  ])

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
