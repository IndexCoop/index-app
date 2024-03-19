import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { Token, WSTETH } from '@/constants/tokens'
import { IndexApi } from '@/lib/utils/api/index-api'
import { getDefaultIndex } from '@/lib/utils/tokens'

interface DepositContextProps {
  isDepositing: boolean
  inputToken: Token
  outputToken: Token
  toggleIsDepositing: () => void
}

const DepositContext = createContext<DepositContextProps>({
  isDepositing: true,
  inputToken: WSTETH,
  outputToken: getDefaultIndex(),
  toggleIsDepositing: () => {},
})

export const useDeposit = () => useContext(DepositContext)

export function DepositProvider(props: { children: any }) {
  const [isDepositing, setDepositing] = useState<boolean>(true)
  // TODO:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputToken, setInputToken] = useState<Token>(WSTETH)
  // TODO:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [outputToken, setOutputToken] = useState<Token>(getDefaultIndex())

  const toggleIsDepositing = useCallback(() => {
    setDepositing(!isDepositing)
  }, [isDepositing])

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const indexApi = new IndexApi()
  //       const res = await indexApi.get(`/token/${outputToken.symbol}`)
  //       console.log('fetch:', res.data)
  //       setStats(res.data)
  //     } catch (err) {
  //       console.log('Error fetching token stats', err)
  //     }
  //   }
  //   fetchStats()
  // }, [outputToken])

  return (
    <DepositContext.Provider
      value={{
        isDepositing,
        inputToken,
        outputToken,
        toggleIsDepositing,
      }}
    >
      {props.children}
    </DepositContext.Provider>
  )
}
