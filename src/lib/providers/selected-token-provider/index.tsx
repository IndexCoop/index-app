import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useParams, useRouter } from 'next/navigation'

import { PathResolver } from '@/app/swap/[[...path]]/path-resolver'
import { ETH, Token } from '@/constants/tokens'
import { getDefaultIndex } from '@/lib/utils/tokens'

export interface TokenContext {
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  selectInputToken: (inputToken: Token) => void
  selectOutputToken: (inputToken: Token) => void
  toggleIsMinting: () => void
}

export const SelectedTokenContext = createContext<TokenContext>({
  isMinting: true,
  inputToken: ETH,
  outputToken: getDefaultIndex(),
  selectInputToken: () => {},
  selectOutputToken: () => {},
  toggleIsMinting: () => {},
})

export const useSelectedToken = () => useContext(SelectedTokenContext)

export const SelectedTokenProvider = (props: { children: any }) => {
  const [isMinting, setMinting] = useState<boolean>(true)
  const [inputToken, setInputToken] = useState<Token>(ETH)
  const [outputToken, setOutputToken] = useState<Token>(getDefaultIndex())

  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const resolver = new PathResolver()
    const tokens = resolver.resolve(params.path as string[])
    setMinting(tokens.isMinting)
    setInputToken(tokens.inputToken)
    setOutputToken(tokens.outputToken)
  }, [params.path])

  const routeSwap = useCallback(
    (inputToken: string, outputToken: string) => {
      router.replace(
        `/swap/${inputToken.toLowerCase()}/${outputToken.toLowerCase()}`
      )
    },
    [router]
  )

  const selectInputToken = useCallback(
    (inputToken: Token) => {
      routeSwap(inputToken.symbol, outputToken.symbol)
    },
    [outputToken, routeSwap]
  )

  const selectOutputToken = useCallback(
    (outputToken: Token) => {
      routeSwap(inputToken.symbol, outputToken.symbol)
    },
    [inputToken, routeSwap]
  )

  const toggleIsMinting = useCallback(() => {
    routeSwap(outputToken.symbol, inputToken.symbol)
  }, [inputToken, outputToken, routeSwap])

  return (
    <SelectedTokenContext.Provider
      value={{
        isMinting,
        inputToken,
        outputToken,
        selectInputToken,
        selectOutputToken,
        toggleIsMinting,
      }}
    >
      {props.children}
    </SelectedTokenContext.Provider>
  )
}
