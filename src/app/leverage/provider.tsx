import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { BTC, ETH, Token, USDC } from '@/constants/tokens'
import { IndexApi } from '@/lib/utils/api/index-api'
import { getDefaultIndex } from '@/lib/utils/tokens'

import { BaseTokenStats } from './types'

export enum LeverageType {
  Long2x,
  Long3x,
  Short,
}

export interface TokenContext {
  isMinting: boolean
  leverageType: LeverageType
  inputToken: Token
  outputToken: Token
  stats: BaseTokenStats | null
  toggleIsMinting: () => void
}

export const LeverageTokenContext = createContext<TokenContext>({
  isMinting: true,
  leverageType: LeverageType.Long2x,
  inputToken: ETH,
  outputToken: getDefaultIndex(),
  stats: null,
  toggleIsMinting: () => {},
})

export const useLeverageToken = () => useContext(LeverageTokenContext)

export function LeverageProvider(props: { children: any }) {
  const [isMinting, setMinting] = useState<boolean>(true)
  // TODO:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputToken, setInputToken] = useState<Token>(USDC)
  // TODO:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [outputToken, setOutputToken] = useState<Token>(BTC)
  const [leverageType, setLeverageType] = useState<LeverageType>(
    LeverageType.Long2x,
  )
  const [stats, setStats] = useState<BaseTokenStats | null>(null)

  const toggleIsMinting = useCallback(() => {
    setMinting(!isMinting)
  }, [isMinting])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const indexApi = new IndexApi()
        const res = await indexApi.get(`/token/${outputToken.symbol}`)
        console.log('fetch:', res.data)
        setStats(res.data)
      } catch (err) {
        console.log('Error fetching token stats', err)
      }
    }
    fetchStats()
  }, [outputToken])

  return (
    <LeverageTokenContext.Provider
      value={{
        isMinting,
        leverageType,
        inputToken,
        outputToken,
        stats,
        toggleIsMinting,
      }}
    >
      {props.children}
    </LeverageTokenContext.Provider>
  )
}
