import { createContext, useContext, useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { PathResolver } from '@/app/swap/[[...path]]/path-resolver'
import { ETH, Token } from '@/constants/tokens'
import { getDefaultIndex } from '@/lib/utils/tokens'

export interface TokenContext {
  inputToken: Token
  outputToken: Token
  selectInputToken: (inputToken: Token) => void
  selectOutputToken: (inputToken: Token) => void
}

export const SelectedTokenContext = createContext<TokenContext>({
  inputToken: ETH,
  outputToken: getDefaultIndex(),
  selectInputToken: () => {},
  selectOutputToken: () => {},
})

export const useSelectedToken = () => useContext(SelectedTokenContext)

export const SelectedTokenProvider = (props: { children: any }) => {
  const [inputToken, setInputToken] = useState<Token>(ETH)
  const [outputToken, setOutputToken] = useState<Token>(getDefaultIndex())

  const params = useParams()
  const router = useRouter()

  // TODO: comment out and just use simple setters from outside for now
  // TODO: delete use trade token lists
  // // TODO: params.path
  // useEffect(() => {
  //   const resolver = new PathResolver()
  //   const tokens = resolver.resolve(params.path as string[])
  //   setInputToken(tokens.inputToken)
  //   setOutputToken(tokens.outputToken)
  // }, [])

  const routeSwap = (inputToken: string, outputToken: string) => {
    router.push(
      `/swap/${inputToken.toLowerCase()}/${outputToken.toLowerCase()}`
    )
  }

  const selectInputToken = (inputToken: Token) => {
    setInputToken(inputToken)
    // routeSwap(inputToken.symbol, outputToken.symbol)
  }

  const selectOutputToken = (outputToken: Token) => {
    setOutputToken(outputToken)
    // routeSwap(inputToken.symbol, outputToken.symbol)
  }

  // TODO:
  // const toggleIsMinting = () => {
  //   // TODO: test
  //   setIsBuying(!isBuying)
  //   routeSwap(outputToken.symbol, inputToken.symbol)
  // }

  return (
    <SelectedTokenContext.Provider
      value={{
        inputToken,
        outputToken,
        selectInputToken,
        selectOutputToken,
        // toggleIsMinting,
      }}
    >
      {props.children}
    </SelectedTokenContext.Provider>
  )
}
