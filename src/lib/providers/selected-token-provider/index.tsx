import { createContext, useContext, useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { PathResolver } from '@/app/swap/[[...path]]/path-resolver'
import { ETH, Token, icETHIndex } from '@/constants/tokens'

export interface TokenContext {
  inputToken: Token | null
  outputToken: Token | null
  selectInputToken: (inputToken: Token) => void
  selectOutputToken: (inputToken: Token) => void
}

export const SelectedTokenContext = createContext<TokenContext>({
  inputToken: null,
  outputToken: null,
  selectInputToken: () => {},
  selectOutputToken: () => {},
})

export const useSelectedToken = () => useContext(SelectedTokenContext)

export const SelectedTokenProvider = (props: { children: any }) => {
  const [inputToken, setInputToken] = useState<Token>(ETH)
  const [outputToken, setOutputToken] = useState<Token>(icETHIndex)

  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const resolver = new PathResolver()
    const tokens = resolver.resolve(params.path as string[])
    setInputToken(tokens.inputToken)
    setOutputToken(tokens.outputToken)
  }, [])

  const routeSwap = (inputToken: string, outputToken: string) => {
    router.push(
      `/swap/${inputToken.toLowerCase()}/${outputToken.toLowerCase()}`
    )
  }

  const selectInputToken = (inputToken: Token) => {
    routeSwap(inputToken.symbol, outputToken.symbol)
  }

  const selectOutputToken = (outputToken: Token) => {
    routeSwap(inputToken.symbol, outputToken.symbol)
  }

  return (
    <SelectedTokenContext.Provider
      value={{
        inputToken,
        outputToken,
        selectInputToken,
        selectOutputToken,
      }}
    >
      {props.children}
    </SelectedTokenContext.Provider>
  )
}
