import { useParams, useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { PathResolver } from '@/app/swap/[[...path]]/path-resolver'
import { ETH, type Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/use-network'
import { getDefaultIndex } from '@/lib/utils/tokens'

export interface TokenContext {
  isMinting: boolean
  inputToken: Token
  outputToken: Token
  shouldShowToggle: boolean
  selectInputToken: (inputToken: Token) => void
  selectOutputToken: (inputToken: Token) => void
  toggleIsMinting: () => void
}

export const SelectedTokenContext = createContext<TokenContext>({
  isMinting: false,
  inputToken: ETH,
  outputToken: getDefaultIndex(),
  shouldShowToggle: true,
  selectInputToken: () => {},
  selectOutputToken: () => {},
  toggleIsMinting: () => {},
})

export const useSelectedToken = () => useContext(SelectedTokenContext)

export const SelectedTokenProvider = (props: { children: any }) => {
  const [isMinting, setMinting] = useState<boolean>(false)
  const [inputToken, setInputToken] = useState<Token>(ETH)
  const [outputToken, setOutputToken] = useState<Token>(getDefaultIndex())

  const { chainId } = useNetwork()
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const resolver = new PathResolver()
    const tokens = resolver.resolve(params.path as string[], chainId)
    setMinting(tokens.isMinting)
    setInputToken(tokens.inputToken)
    setOutputToken(tokens.outputToken)
  }, [chainId, params.path])

  const routeSwap = useCallback(
    (inputToken: string, outputToken: string) => {
      router.replace(
        `/swap/${inputToken.toLowerCase()}/${outputToken.toLowerCase()}`,
      )
    },
    [router],
  )

  const selectInputToken = useCallback(
    (inputToken: Token) => {
      routeSwap(inputToken.symbol, outputToken.symbol)
    },
    [outputToken, routeSwap],
  )

  const selectOutputToken = useCallback(
    (outputToken: Token) => {
      routeSwap(inputToken.symbol, outputToken.symbol)
    },
    [inputToken, routeSwap],
  )

  const shouldShowToggle = useMemo(() => {
    return inputToken.symbol === 'INDEX' || outputToken.symbol === 'INDEX'
  }, [inputToken.symbol, outputToken.symbol])

  const toggleIsMinting = useCallback(() => {
    if (inputToken.symbol === 'INDEX' || outputToken.symbol === 'INDEX') {
      routeSwap(outputToken.symbol, inputToken.symbol)
    }
  }, [inputToken, outputToken, routeSwap])

  return (
    <SelectedTokenContext.Provider
      value={{
        isMinting,
        inputToken,
        outputToken,
        shouldShowToggle,
        selectInputToken,
        selectOutputToken,
        toggleIsMinting,
      }}
    >
      {props.children}
    </SelectedTokenContext.Provider>
  )
}
