import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { usePublicClient } from 'wagmi'

import { Issuance, LegacyTokenList } from '@/app/legacy/config'
import { LegacyRedemptionQuoteResult } from '@/app/legacy/types'
import { LeveragedRethStakingYield, Token } from '@/constants/tokens'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getLegacyRedemptionQuote } from '@/lib/hooks/use-best-quote/utils/issuance/legacy-quote'
import { useNativeTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isValidTokenInput, parseUnits } from '@/lib/utils'

interface RedeemContextProps {
  inputTokenList: Token[]
  inputValue: string
  isDepositing: boolean
  isFetchingQuote: boolean
  inputToken: Token
  outputTokens: Token[]
  inputTokenAmount: bigint
  issuance: string
  quoteResult: LegacyRedemptionQuoteResult | null
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
  outputTokens: [],
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
  const queryClient = useQueryClient()
  const { address, provider } = useWallet()

  const [inputToken, setInputToken] = useState(LegacyTokenList[0])
  const [inputValue, setInputValue] = useState('')

  const queryKey = 'legay-quote-result'
  const initialData: LegacyRedemptionQuoteResult = {
    type: QuoteType.issuance,
    isAvailable: true,
    quote: null,
    legacy: null,
    error: null,
  }

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : parseUnits(inputValue, inputToken.decimals),
    [inputToken, inputValue],
  )

  const { data: quoteResult, isFetching: isFetchingQuote } = useQuery({
    initialData,
    queryKey: [
      queryKey,
      {
        address,
        inputToken,
        inputValue,
        nativeTokenPrice,
        provider,
        publicClient,
      },
    ],
    queryFn: async () => {
      if (!address) return null
      if (!provider || !publicClient) return null
      const inputTokenAmount =
        inputValue === ''
          ? BigInt(0)
          : parseUnits(inputValue, inputToken.decimals)
      if (inputTokenAmount <= 0) return null
      const gasPrice = await provider.getGasPrice()
      const legacyQuote = await getLegacyRedemptionQuote(
        {
          account: address,
          inputTokenAmount,
          inputToken,
          gasPrice,
          nativeTokenPrice,
          slippage: 0,
        },
        publicClient,
      )
      return {
        type: QuoteType.issuance,
        isAvailable: true,
        quote: legacyQuote?.quote ?? null,
        legacy: legacyQuote?.extended ?? null,
        error: null,
      }
    },
  })

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
    queryClient.setQueryData([queryKey], initialData)
  }

  return (
    <RedeemContext.Provider
      value={{
        inputTokenList: LegacyTokenList,
        inputValue,
        isDepositing: false,
        isFetchingQuote,
        inputToken,
        outputTokens: quoteResult?.legacy?.outputTokens ?? [],
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
