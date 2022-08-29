import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { BigNumber, Contract, utils } from 'ethers'

import { JsonRpcProvider } from '@ethersproject/providers'

import tokenList, { Token } from 'constants/tokens'
import { useAllReadOnlyProviders } from 'hooks/useReadOnlyProvider'
import { useWallet } from 'hooks/useWallet'
import { useMarketData } from 'providers/MarketData'
import { ERC20_ABI } from 'utils/abi/ERC20'

export interface BalanceValues {
  token: Token
  mainnetBalance: BigNumber | null
  polygonBalance: BigNumber | null
  optimismBalance: BigNumber | null
  price: number
}

export interface TokenContext {
  tokenBalances: { [key: string]: BalanceValues }
}

const ERC20Interface = new utils.Interface(ERC20_ABI)

export type TokenContextKeys = keyof TokenContext

export const BalanceContext = createContext<TokenContext>({
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

  const fetchBalanceData = useCallback(async () => {
    if (!address) return
    let balanceData: { [key: string]: BalanceValues } = {}
    tokenList.forEach(async (token) => {
      const marketData = selectMarketDataByToken(token)
      const price = selectLatestMarketData(marketData)
      console.log('price', price, marketData)

      const mainnetBalance = await getBalance(
        address,
        token.address,
        mainnetReadOnlyProvider
      )

      const polygonBalance = await getBalance(
        address,
        token.polygonAddress,
        polygonReadOnlyProvider
      )

      const optimismBalance = await getBalance(
        address,
        token.optimismAddress,
        optimismReadOnlyProvider
      )

      if (
        (mainnetBalance && !mainnetBalance.isZero()) ||
        (polygonBalance && !polygonBalance.isZero()) ||
        (optimismBalance && !optimismBalance.isZero())
      )
        balanceData[token.symbol] = {
          token,
          mainnetBalance,
          polygonBalance,
          optimismBalance,
          price,
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
