import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { BigNumber, Contract, utils } from 'ethers'

import { JsonRpcProvider } from '@ethersproject/providers'

import tokenList from 'constants/tokens'
import { useAllReadOnlyProviders } from 'hooks/useReadOnlyProvider'
import { useWallet } from 'hooks/useWallet'
import { useMarketData } from 'providers/MarketData'
import { ERC20_ABI } from 'utils/abi/ERC20'
import { fetchHistoricalTokenMarketData } from 'utils/coingeckoApi'

export interface BalanceValues {
  mainnetBalance: BigNumber
  polygonBalance: BigNumber
  optimismBalance: BigNumber
  price: number
}

export interface TokenContext {
  tokenBalances?: { [key: string]: BalanceValues }
}

const ERC20Interface = new utils.Interface(ERC20_ABI)

export type TokenContextKeys = keyof TokenContext

export const BalanceContext = createContext<TokenContext>({})

export const useBalanceData = () => useContext(BalanceContext)

const getBalance = async (
  address: string,
  tokenAddress: string,
  provider: JsonRpcProvider
): Promise<BigNumber> => {
  const contract = new Contract(tokenAddress, ERC20Interface, provider)
  const bal = await contract.balanceOf(address)
  return bal
}

export const BalanceProvider = (props: { children: any }) => {
  const { address } = useWallet()
  const { selectLatestMarketData } = useMarketData()
  const {
    mainnetReadOnlyProvider,
    optimismReadOnlyProvider,
    polygonReadOnlyProvider,
  } = useAllReadOnlyProviders()
  const [tokenBalances, setTokenBalances] = useState<{
    [key: string]: BalanceValues
  }>({})

  const fetchBalanceData = useCallback(async () => {
    if (!address) return
    let balanceData: { [key: string]: BalanceValues } = {}
    tokenList.forEach(async (token) => {
      const marketData = await fetchHistoricalTokenMarketData(token.coingeckoId)
      let mainnetBalance = BigNumber.from(0)
      let polygonBalance = BigNumber.from(0)
      let optimismBalance = BigNumber.from(0)

      if (token.address !== undefined) {
        mainnetBalance = await getBalance(
          address,
          token.address,
          mainnetReadOnlyProvider
        )
      }
      if (token.polygonAddress !== undefined) {
        polygonBalance = await getBalance(
          address,
          token.polygonAddress,
          polygonReadOnlyProvider
        )
      }
      if (token.optimismAddress !== undefined) {
        optimismBalance = await getBalance(
          address,
          token.optimismAddress,
          optimismReadOnlyProvider
        )
      }

      if (
        !mainnetBalance.isZero() ||
        !polygonBalance.isZero() ||
        !optimismBalance.isZero()
      )
        balanceData[token.symbol] = {
          mainnetBalance,
          polygonBalance,
          optimismBalance,
          price: selectLatestMarketData(marketData),
        }
    })
    setTokenBalances(balanceData)
  }, [])

  useEffect(() => {
    if (!address || address === undefined) return
    fetchBalanceData()
  }, [address])

  return (
    <BalanceContext.Provider
      value={{
        tokenBalances,
      }}
    >
      {props.children}
    </BalanceContext.Provider>
  )
}
