import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePublicClient } from 'wagmi'

import { LeveragedRethStakingYield, RETH, Token } from '@/constants/tokens'
import { getEnhancedIssuanceQuote } from '@/lib/hooks/use-best-quote/utils/issuance'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getTokenPrice, useNativeTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isValidTokenInput, toWei } from '@/lib/utils'

interface RedeemContextProps {
  inputValue: string
  isDepositing: boolean
  isFetchingQuote: boolean
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  quoteResult: QuoteResult | null
  onChangeInputTokenAmount: (input: string) => void
  reset: () => void
}

const RedeemContext = createContext<RedeemContextProps>({
  inputValue: '',
  isDepositing: false,
  isFetchingQuote: false,
  inputToken: LeveragedRethStakingYield,
  outputToken: RETH,
  inputTokenAmount: BigInt(0),
  quoteResult: null,
  onChangeInputTokenAmount: () => {},
  reset: () => {},
})

export const useRedeem = () => useContext(RedeemContext)

export function RedeemProvider(props: { children: any }) {
  const nativeTokenPrice = useNativeTokenPrice(1)
  const publicClient = usePublicClient()
  const { address, provider } = useWallet()

  const isDepositing = false
  const currencyToken = RETH
  const indexToken = LeveragedRethStakingYield

  const [inputValue, setInputValue] = useState('')
  const [isFetchingQuote, setFetchingQuote] = useState(false)
  const [quoteResult, setQuoteResult] = useState<QuoteResult>({
    type: QuoteType.issuance,
    isAvailable: true,
    quote: null,
    error: null,
  })

  const inputToken = useMemo(
    () => (isDepositing ? currencyToken : indexToken),
    [isDepositing, currencyToken, indexToken],
  )

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : toWei(inputValue, inputToken.decimals).toBigInt(),
    [inputToken, inputValue],
  )

  const outputToken = useMemo(
    () => (isDepositing ? indexToken : currencyToken),
    [isDepositing, currencyToken, indexToken],
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
    const fetchQuote = async () => {
      if (!address) return
      if (!provider || !publicClient) return
      if (inputTokenAmount <= 0) return
      setFetchingQuote(true)
      const outputToken = isDepositing ? indexToken : currencyToken
      const inputTokenPrice = await getTokenPrice(inputToken, 1)
      const outputTokenPrice = await getTokenPrice(outputToken, 1)
      const gasPrice = await provider.getGasPrice()
      const quoteIssuance = await getEnhancedIssuanceQuote(
        {
          account: address,
          isIssuance: isDepositing,
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
    currencyToken,
    indexToken,
    inputToken,
    inputTokenAmount,
    isDepositing,
    nativeTokenPrice,
    provider,
    publicClient,
  ])

  return (
    <RedeemContext.Provider
      value={{
        inputValue,
        isDepositing,
        isFetchingQuote,
        inputToken,
        outputToken,
        inputTokenAmount,
        quoteResult,
        onChangeInputTokenAmount,
        reset,
      }}
    >
      {props.children}
    </RedeemContext.Provider>
  )
}
