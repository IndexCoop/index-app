import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePublicClient } from 'wagmi'

import { HighYieldETHIndex, Token, WSTETH } from '@/constants/tokens'
import { getEnhancedIssuanceQuote } from '@/lib/hooks/use-best-quote/utils/issuance'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getTokenPrice, useNativeTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isValidTokenInput, toWei } from '@/lib/utils'

interface DepositContextProps {
  inputValue: string
  isDepositing: boolean
  isFetchingQuote: boolean
  preSaleCurrencyToken: Token
  preSaleToken: Token
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  quoteResult: QuoteResult | null
  onChangeInputTokenAmount: (input: string) => void
  toggleIsDepositing: () => void
}

const DepositContext = createContext<DepositContextProps>({
  inputValue: '',
  isDepositing: true,
  isFetchingQuote: false,
  preSaleCurrencyToken: WSTETH,
  preSaleToken: HighYieldETHIndex,
  inputToken: WSTETH,
  outputToken: HighYieldETHIndex,
  inputTokenAmount: BigInt(0),
  quoteResult: null,
  onChangeInputTokenAmount: () => {},
  toggleIsDepositing: () => {},
})

export const useDeposit = () => useContext(DepositContext)

export function DepositProvider(props: { children: any; preSaleToken: Token }) {
  const nativeTokenPrice = useNativeTokenPrice(1)
  const publicClient = usePublicClient()
  const { address, provider } = useWallet()

  const { preSaleToken } = props
  const preSaleCurrencyToken = WSTETH

  const [inputValue, setInputValue] = useState('')
  const [isDepositing, setDepositing] = useState(true)
  const [isFetchingQuote, setFetchingQuote] = useState(false)
  const [quoteResult, setQuoteResult] = useState<QuoteResult>({
    type: QuoteType.issuance,
    isAvailable: true,
    quote: null,
    error: null,
  })

  const inputToken = useMemo(
    () => (isDepositing ? preSaleCurrencyToken : preSaleToken),
    [isDepositing, preSaleCurrencyToken, preSaleToken],
  )

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : toWei(inputValue, inputToken.decimals).toBigInt(),
    [inputToken, inputValue],
  )

  const outputToken = useMemo(
    () => (isDepositing ? preSaleToken : preSaleCurrencyToken),
    [isDepositing, preSaleCurrencyToken, preSaleToken],
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

  const toggleIsDepositing = useCallback(() => {
    setDepositing(!isDepositing)
  }, [isDepositing])

  useEffect(() => {
    const fetchQuote = async () => {
      if (!address) return
      if (inputTokenAmount <= 0) return
      setFetchingQuote(true)
      const outputToken = isDepositing ? preSaleToken : preSaleCurrencyToken
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
    inputToken,
    inputTokenAmount,
    isDepositing,
    nativeTokenPrice,
    preSaleCurrencyToken,
    preSaleToken,
    provider,
    publicClient,
  ])

  return (
    <DepositContext.Provider
      value={{
        inputValue,
        isDepositing,
        isFetchingQuote,
        preSaleCurrencyToken,
        preSaleToken,
        inputToken,
        outputToken,
        inputTokenAmount,
        quoteResult,
        onChangeInputTokenAmount,
        toggleIsDepositing,
      }}
    >
      {props.children}
    </DepositContext.Provider>
  )
}
