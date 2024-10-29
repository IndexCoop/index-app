import { BigNumber } from 'ethers'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePublicClient } from 'wagmi'

import { PreSaleStatus } from '@/app/(light)/presales/types'
import {
  ETH,
  HighYieldETHIndex,
  Token,
  USDC,
  USDT,
  WETH,
  WSTETH,
} from '@/constants/tokens'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getFlashMintQuote } from '@/lib/hooks/use-best-quote/utils/flashmint'
import { getEnhancedIssuanceQuote } from '@/lib/hooks/use-best-quote/utils/issuance'
import { getTokenPrice, useNativeTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isValidTokenInput, parseUnits } from '@/lib/utils'

interface DepositContextProps {
  inputValue: string
  isDepositing: boolean
  isFetchingQuote: boolean
  inputTokens: Token[]
  preSaleCurrencyToken: Token
  preSaleToken: Token
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  quoteResult: QuoteResult | null
  onChangeInputTokenAmount: (input: string) => void
  onSelectInputToken: (symbol: string) => void
  reset: () => void
  toggleIsDepositing: () => void
}

const inputTokens = [WSTETH, ETH, WETH, USDC, USDT]

const DepositContext = createContext<DepositContextProps>({
  inputValue: '',
  isDepositing: true,
  isFetchingQuote: false,
  inputTokens,
  preSaleCurrencyToken: WSTETH,
  preSaleToken: HighYieldETHIndex,
  inputToken: WSTETH,
  outputToken: HighYieldETHIndex,
  inputTokenAmount: BigInt(0),
  quoteResult: null,
  onChangeInputTokenAmount: () => {},
  onSelectInputToken: () => {},
  reset: () => {},
  toggleIsDepositing: () => {},
})

export const useDeposit = () => useContext(DepositContext)

export function DepositProvider(props: {
  children: any
  preSaleToken: Token
  preSaleStatus: PreSaleStatus | undefined
}) {
  const nativeTokenPrice = useNativeTokenPrice(1)
  const publicClient = usePublicClient()
  const { address, provider, rpcUrl } = useWallet()

  const { preSaleToken } = props
  const preSaleCurrencyToken = WSTETH

  const [inputToken, setInputToken] = useState(preSaleCurrencyToken)
  const [inputValue, setInputValue] = useState('')
  const [isDepositing, setDepositing] = useState(
    props.preSaleStatus !== PreSaleStatus.CLOSED_TARGET_NOT_MET,
  )
  const [isFetchingQuote, setFetchingQuote] = useState(false)
  const [quoteResult, setQuoteResult] = useState<QuoteResult>({
    type: QuoteType.issuance,
    isAvailable: true,
    quote: null,
    error: null,
  })

  useEffect(() => {
    if (isDepositing) {
      setInputToken(preSaleCurrencyToken)
      return
    }
    setInputToken(preSaleToken)
  }, [isDepositing, preSaleCurrencyToken, preSaleToken])

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : parseUnits(inputValue, inputToken.decimals),
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

  const onSelectInputToken = useCallback(
    (tokenSymbol: string) => {
      if (!isDepositing) return
      const token = inputTokens.find((token) => token.symbol === tokenSymbol)
      if (!token) return
      setInputToken(token)
    },
    [isDepositing],
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

  const toggleIsDepositing = useCallback(() => {
    if (props.preSaleStatus === PreSaleStatus.CLOSED_TARGET_NOT_MET) return
    setDepositing(!isDepositing)
  }, [isDepositing, props.preSaleStatus])

  useEffect(() => {
    const fetchQuote = async () => {
      if (!address) return
      if (!provider || !publicClient) return
      if (inputTokenAmount <= 0) return
      setFetchingQuote(true)
      const inputTokenPrice = await getTokenPrice(inputToken, 1)
      const outputTokenPrice = await getTokenPrice(outputToken, 1)
      let quoteIssuance = null
      if (isDepositing) {
        quoteIssuance = await getFlashMintQuote(
          {
            account: address,
            chainId: 1,
            isMinting: isDepositing,
            inputToken,
            inputTokenAmount: inputValue,
            inputTokenAmountWei: BigNumber.from(inputTokenAmount.toString()),
            inputTokenPrice,
            outputToken,
            outputTokenPrice,
            nativeTokenPrice,
            slippage: 0,
          },
          provider,
          rpcUrl,
        )
      } else {
        const gasPrice = await provider.getGasPrice()
        quoteIssuance = await getEnhancedIssuanceQuote(
          {
            isIssuance: isDepositing,
            account: address,
            gasPrice,
            inputToken,
            inputTokenAmount,
            inputTokenPrice,
            outputToken,
            outputTokenPrice,
            nativeTokenPrice,
            slippage: 0,
          },
          publicClient,
        )
      }
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
    inputValue,
    isDepositing,
    nativeTokenPrice,
    outputToken,
    preSaleCurrencyToken,
    preSaleToken,
    provider,
    publicClient,
    rpcUrl,
  ])

  return (
    <DepositContext.Provider
      value={{
        inputValue,
        isDepositing,
        isFetchingQuote,
        inputTokens,
        preSaleCurrencyToken,
        preSaleToken,
        inputToken,
        outputToken,
        inputTokenAmount,
        quoteResult,
        onChangeInputTokenAmount,
        onSelectInputToken,
        reset,
        toggleIsDepositing,
      }}
    >
      {props.children}
    </DepositContext.Provider>
  )
}
