import { createContext, useCallback, useContext, useState } from 'react'

import { BTC, ETH, Token, USDC } from '@/constants/tokens'
import { getDefaultIndex } from '@/lib/utils/tokens'

export interface TokenContext {
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  toggleIsMinting: () => void
}

export const LeverageTokenContext = createContext<TokenContext>({
  isMinting: true,
  inputToken: ETH,
  outputToken: getDefaultIndex(),
  toggleIsMinting: () => {},
})

export const useLeverageToken = () => useContext(LeverageTokenContext)

export function LeverageProvider(props: { children: any }) {
  const [isMinting, setMinting] = useState<boolean>(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputToken, setInputToken] = useState<Token>(USDC)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [outputToken, setOutputToken] = useState<Token>(BTC)

  const toggleIsMinting = useCallback(() => {
    setMinting(!isMinting)
  }, [isMinting])

  return (
    <LeverageTokenContext.Provider
      value={{
        isMinting,
        inputToken,
        outputToken,
        toggleIsMinting,
      }}
    >
      {props.children}
    </LeverageTokenContext.Provider>
  )
}
