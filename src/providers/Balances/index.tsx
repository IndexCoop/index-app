import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { BigNumber, Contract } from 'ethers'

import tokenList from 'constants/tokens'
import { useWallet } from 'hooks/useWallet'
import { fetchHistoricalTokenMarketData } from 'utils/coingeckoApi'
import { useBalance } from 'wagmi'
import { useNetwork } from 'hooks/useNetwork'

export interface BalanceValues {
  balance: BigNumber
  price: number
}

export interface TokenContext {
  tokenBalances?: { [key: string]: BalanceValues }
}

export type TokenContextKeys = keyof TokenContext

export const BalanceContext = createContext<TokenContext>({})

export const useBalanceData = () => useContext(BalanceContext)

export const BalanceProvider = (props: { children: any }) => {
  const { address, provider } = useWallet()
  const {chainId} = useNetwork()
  const [tokenBalances, setTokenBalances] = useState<{
    [key: string]: BalanceValues
  }>({})

  const fetchBalanceData = useCallback(async () => {
    let balanceData: { [key: string]: BalanceValues } = {}
    tokenList.forEach((token) => {
      const get
      const bal = new Contract(token., ERC20Interface, signer)
      balanceData[token.symbol] = {
        balance: BigNumber.from(0),
        price: 0,
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
