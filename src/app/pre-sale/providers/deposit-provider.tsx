import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { parseEther } from 'viem'

import { Token, WSTETH } from '@/constants/tokens'
import { getDefaultIndex } from '@/lib/utils/tokens'

interface DepositContextProps {
  isDepositing: boolean
  preSaleCurrencyToken: Token
  preSaleToken: Token
  tvl: bigint
  userBalance: bigint
  toggleIsDepositing: () => void
}

const DepositContext = createContext<DepositContextProps>({
  isDepositing: true,
  preSaleCurrencyToken: WSTETH,
  preSaleToken: getDefaultIndex(),
  tvl: BigInt(0),
  userBalance: BigInt(0),
  toggleIsDepositing: () => {},
})

export const useDeposit = () => useContext(DepositContext)

export function DepositProvider(props: { children: any; preSaleToken: Token }) {
  const { preSaleToken } = props
  const preSaleCurrencyToken = WSTETH

  const [isDepositing, setDepositing] = useState<boolean>(true)
  const [tvl, setTvl] = useState(BigInt(0))
  const [userBalance, setUserBalance] = useState(BigInt(0))

  const toggleIsDepositing = useCallback(() => {
    setDepositing(!isDepositing)
  }, [isDepositing])

  useEffect(() => {
    // TOOD: fetch balance of user
    // TODO: fetch hyETH supply
    // const fetchStats = async () => {
    //   try {
    //     const indexApi = new IndexApi()
    //     const res = await indexApi.get(`/token/${outputToken.symbol}`)
    //     console.log('fetch:', res.data)
    //     setStats(res.data)
    //   } catch (err) {
    //     console.log('Error fetching token stats', err)
    //   }
    // }
    // fetchStats()
    setTvl(parseEther('658'))
    setUserBalance(parseEther('12'))
  }, [preSaleToken])

  return (
    <DepositContext.Provider
      value={{
        isDepositing,
        preSaleCurrencyToken,
        preSaleToken,
        tvl,
        userBalance,
        toggleIsDepositing,
      }}
    >
      {props.children}
    </DepositContext.Provider>
  )
}
