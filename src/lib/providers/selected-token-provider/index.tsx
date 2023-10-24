import { createContext, useContext, useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { PathResolver } from '@/app/swap/[[...path]]/pathResolver'
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

  const selectInputToken = (inputToken: Token) => {
    router.push(
      `/swap/${inputToken.symbol.toLowerCase()}/${outputToken.symbol.toLowerCase()}`
    )
  }

  const selectOutputToken = (outputToken: Token) => {
    router.push(
      `/swap/${inputToken.symbol.toLowerCase()}/${outputToken.symbol.toLowerCase()}`
    )
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
