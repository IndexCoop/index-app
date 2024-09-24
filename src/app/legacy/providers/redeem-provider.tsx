import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePublicClient } from 'wagmi'

import { Issuance, LegacyTokenList } from '@/app/legacy/config'
import { getOutputToken } from '@/app/legacy/providers/utils'
import { LeveragedRethStakingYield, RETH, Token } from '@/constants/tokens'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getEnhancedIssuanceQuote } from '@/lib/hooks/use-best-quote/utils/issuance'
import { getTokenPrice, useNativeTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isValidTokenInput, parseUnits } from '@/lib/utils'

interface RedeemContextProps {
  inputTokenList: Token[]
  inputValue: string
  isDepositing: boolean
  isFetchingQuote: boolean
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  issuance: string
  quoteResult: QuoteResult | null
  onChangeInputTokenAmount: (input: string) => void
  onSelectInputToken: (tokenSymbol: string) => void
  reset: () => void
}

const RedeemContext = createContext<RedeemContextProps>({
  inputTokenList: LegacyTokenList,
  inputValue: '',
  isDepositing: false,
  isFetchingQuote: false,
  inputToken: LeveragedRethStakingYield,
  outputToken: RETH,
  inputTokenAmount: BigInt(0),
  issuance: Issuance[LeveragedRethStakingYield.symbol],
  quoteResult: null,
  onChangeInputTokenAmount: () => {},
  onSelectInputToken: () => {},
  reset: () => {},
})

export const useRedeem = () => useContext(RedeemContext)

export function RedeemProvider(props: { children: any }) {
  const nativeTokenPrice = useNativeTokenPrice(1)
  const publicClient = usePublicClient()
  const { address, provider } = useWallet()

  const [inputToken, setInputToken] = useState(LegacyTokenList[0])
  const [outputToken, setOutputToken] = useState(RETH)
  const [inputValue, setInputValue] = useState('')
  const [isFetchingQuote, setFetchingQuote] = useState(false)
  const [quoteResult, setQuoteResult] = useState<QuoteResult>({
    type: QuoteType.issuance,
    isAvailable: true,
    quote: null,
    error: null,
  })

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : parseUnits(inputValue, inputToken.decimals),
    [inputToken, inputValue],
  )

  const onChangeInputTokenAmount = useCallback(
    (input: string) => {
      if (input === '') {
        setInputValue('')
        return
      }
      if (!isValidTokenInput(input, inputToken.decimals)) return
      setInputValue(input || '')
    },
    [inputToken],
  )

  const onSelectInputToken = useCallback((tokenSymbol: string) => {
    const token = LegacyTokenList.find((token) => token.symbol === tokenSymbol)
    if (!token) return
    setInputToken(token)
  }, [])

  const reset = () => {
    setInputValue('')
    setQuoteResult({
      type: QuoteType.issuance,
      isAvailable: true,
      quote: null,
      error: null,
    })
  }

  useEffect(() => {
    const fetchOutputToken = async (inputToken: Token) => {
      if (!publicClient) return
      const outputToken = await getOutputToken(
        inputToken.address!,
        publicClient,
      )
      if (!outputToken) return
      setOutputToken(outputToken)
    }
    fetchOutputToken(inputToken)
  }, [inputToken, publicClient])

  useEffect(() => {
    const fetchQuote = async () => {
      if (!address) return
      if (!provider || !publicClient) return
      if (inputTokenAmount <= 0) return
      setFetchingQuote(true)
      const inputTokenPrice = await getTokenPrice(inputToken, 1)
      const outputTokenPrice = await getTokenPrice(outputToken, 1)
      const gasPrice = await provider.getGasPrice()
      const quoteIssuance = await getEnhancedIssuanceQuote(
        {
          account: address,
          isIssuance: false,
          gasPrice,
          inputTokenAmount,
          inputToken,
          inputTokenPrice,
          outputToken,
          outputTokenPrice,
          nativeTokenPrice,
          slippage: 0,
        },
        publicClient,
      )
      setFetchingQuote(false)
      setQuoteResult({
        type: QuoteType.issuance,
        isAvailable: true,
        quote: quoteIssuance,
        error: null,
      })
    }
    fetchQuote()
  }, [
    address,
    inputToken,
    inputTokenAmount,
    nativeTokenPrice,
    outputToken,
    provider,
    publicClient,
  ])

  return (
    <RedeemContext.Provider
      value={{
        inputTokenList: LegacyTokenList,
        inputValue,
        isDepositing: false,
        isFetchingQuote,
        inputToken,
        outputToken,
        inputTokenAmount,
        issuance: Issuance[inputToken.symbol],
        quoteResult,
        onChangeInputTokenAmount,
        onSelectInputToken,
        reset,
      }}
    >
      {props.children}
    </RedeemContext.Provider>
  )
}
