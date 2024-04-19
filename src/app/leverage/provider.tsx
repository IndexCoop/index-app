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

import { TransactionReview } from '@/components/swap/components/transaction-review/types'
import {
  BTC,
  ETH,
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseBitcoinIndex,
  IndexCoopInverseEthereumIndex,
  Token,
  USDC,
  USDT,
  WBTC,
  WETH,
} from '@/constants/tokens'
import { QuoteResult, QuoteType } from '@/lib/hooks/use-best-quote/types'
import { getTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isValidTokenInput, parseUnits } from '@/lib/utils'
import { IndexApi } from '@/lib/utils/api/index-api'
import { getDefaultIndex } from '@/lib/utils/tokens'

import { BaseTokenStats } from './types'

const currencyTokens = [ETH, WETH, WBTC, USDC, USDT]
const indexTokens = [ETH, BTC]

export enum LeverageType {
  Long2x,
  Long3x,
  Short,
}

export interface TokenContext {
  inputValue: string
  isMinting: boolean
  leverageType: LeverageType
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  currencyTokens: Token[]
  indexTokens: Token[]
  isFetchingQuote: boolean
  quoteResult: QuoteResult | null
  stats: BaseTokenStats | null
  transactionReview: TransactionReview | null
  onChangeInputTokenAmount: (input: string) => void
  onSelectCurrencyToken: (tokenSymbol: string) => void
  onSelectIndexToken: (tokenSymbol: string) => void
  onSelectLeverageType: (type: LeverageType) => void
  toggleIsMinting: () => void
}

export const LeverageTokenContext = createContext<TokenContext>({
  inputValue: '',
  isMinting: true,
  leverageType: LeverageType.Long2x,
  inputToken: ETH,
  outputToken: getDefaultIndex(),
  inputTokenAmount: BigInt(0),
  currencyTokens,
  indexTokens,
  isFetchingQuote: false,
  quoteResult: null,
  stats: null,
  transactionReview: null,
  onChangeInputTokenAmount: () => {},
  onSelectCurrencyToken: () => {},
  onSelectIndexToken: () => {},
  onSelectLeverageType: () => {},
  toggleIsMinting: () => {},
})

export const useLeverageToken = () => useContext(LeverageTokenContext)

export function LeverageProvider(props: { children: any }) {
  const publicClient = usePublicClient()
  const { address, provider } = useWallet()

  const [inputValue, setInputValue] = useState('')
  const [isFetchingQuote, setFetchingQuote] = useState(false)
  const [isMinting, setMinting] = useState<boolean>(true)
  const [inputToken, setInputToken] = useState<Token>(WBTC)
  const [outputToken, setOutputToken] = useState<Token>(BTC)
  const [leverageType, setLeverageType] = useState<LeverageType>(
    LeverageType.Long2x,
  )
  const [stats, setStats] = useState<BaseTokenStats | null>(null)
  const [quoteResult, setQuoteResult] = useState<QuoteResult>({
    type: QuoteType.issuance,
    isAvailable: true,
    quote: null,
    error: null,
  })

  const indexToken = useMemo(() => {
    const rawToken = isMinting ? outputToken : inputToken
    if (rawToken.symbol === 'ETH') {
      switch (leverageType) {
        case LeverageType.Long2x:
          return IndexCoopEthereum2xIndex
        case LeverageType.Long3x:
          return IndexCoopEthereum3xIndex
        case LeverageType.Short:
          return IndexCoopInverseEthereumIndex
      }
    }

    if (rawToken.symbol === 'BTC') {
      switch (leverageType) {
        case LeverageType.Long2x:
          return IndexCoopBitcoin2xIndex
        case LeverageType.Long3x:
          return IndexCoopBitcoin3xIndex
        case LeverageType.Short:
          return IndexCoopInverseBitcoinIndex
      }
    }

    return null
  }, [inputToken, isMinting, leverageType, outputToken])

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : parseUnits(inputValue, inputToken.decimals),
    [inputToken, inputValue],
  )

  const transactionReview = useMemo((): TransactionReview | null => {
    if (isFetchingQuote || quoteResult === null) return null
    const quote = quoteResult.quote
    if (quote) {
      return {
        ...quote,
        contractAddress: quote.contract,
        quoteResults: {
          bestQuote: QuoteType.issuance,
          results: {
            flashmint: null,
            issuance: quoteResult,
            redemption: null,
            zeroex: null,
          },
        },
        selectedQuote: QuoteType.issuance,
      }
    }
    return null
  }, [isFetchingQuote, quoteResult])

  const toggleIsMinting = useCallback(() => {
    setMinting(!isMinting)
  }, [isMinting])
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const indexApi = new IndexApi()
        const res = await indexApi.get(`/token/${outputToken.symbol}`)
        setStats(res.data)
      } catch (err) {
        console.log('Error fetching token stats', err)
      }
    }
    fetchStats()
  }, [outputToken])

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

  const onSelectLeverageType = (type: LeverageType) => {
    setLeverageType(type)
  }

  const onSelectCurrencyToken = (tokenSymbol: string) => {
    const token = currencyTokens.find((token) => token.symbol === tokenSymbol)
    if (!token) return
    setInputToken(token)
  }

  const onSelectIndexToken = (tokenSymbol: string) => {
    const token = indexTokens.find((token) => token.symbol === tokenSymbol)
    if (!token) return
    setOutputToken(token)
  }

  useEffect(() => {
    const fetchQuote = async () => {
      if (!address) return
      if (!provider || !publicClient) return
      if (inputTokenAmount <= 0) return
      if (!indexToken) return
      console.log('index-token:', indexToken.symbol)
      setFetchingQuote(true)
      const inputTokenPrice = await getTokenPrice(inputToken, 1)
      const outputTokenPrice = await getTokenPrice(outputToken, 1)
      const gasPrice = await provider.getGasPrice()
      console.log(inputTokenPrice, outputTokenPrice, gasPrice.toString())
      // TODO: get FlashMint quote
      // const quoteIssuance = await getEnhancedIssuanceQuote(
      //   {
      //     account: address,
      //     isIssuance: isDepositing,
      //     gasPrice,
      //     inputTokenAmount,
      //     inputToken,
      //     inputTokenPrice,
      //     outputToken,
      //     outputTokenPrice,
      //     nativeTokenPrice,
      //     slippage: 0,
      //   },
      //   publicClient,
      // )
      setFetchingQuote(false)
      const quoteResult = {
        type: QuoteType.issuance,
        isAvailable: true,
        quote: {
          type: QuoteType.issuance,
          chainId: 1,
          contract: '0x',
          isMinting: true,
          inputToken: ETH,
          outputToken: IndexCoopEthereum2xIndex,
          gas: BigNumber.from(0),
          gasPrice: BigNumber.from(0),
          gasCosts: BigNumber.from(0),
          gasCostsInUsd: 10,
          fullCostsInUsd: 100,
          priceImpact: 0,
          indexTokenAmount: BigNumber.from(1000000),
          inputOutputTokenAmount: BigNumber.from(10000000),
          inputTokenAmount: BigNumber.from(1000000),
          inputTokenAmountUsd: 0,
          outputTokenAmount: BigNumber.from(1000000),
          outputTokenAmountUsd: 0,
          outputTokenAmountUsdAfterFees: 0,
          inputTokenPrice: 0,
          outputTokenPrice: 0,
          slippage: 1,
          tx: {
            account: '0x',
          },
        },
        error: null,
      }

      setQuoteResult(quoteResult)
    }
    fetchQuote()
  }, [
    address,
    indexToken,
    inputToken,
    inputTokenAmount,
    isMinting,
    outputToken,
    provider,
    publicClient,
  ])

  return (
    <LeverageTokenContext.Provider
      value={{
        inputValue,
        isMinting,
        leverageType,
        inputToken,
        outputToken,
        inputTokenAmount,
        currencyTokens,
        indexTokens,
        isFetchingQuote,
        quoteResult,
        stats,
        transactionReview,
        onChangeInputTokenAmount,
        onSelectCurrencyToken,
        onSelectIndexToken,
        onSelectLeverageType,
        toggleIsMinting,
      }}
    >
      {props.children}
    </LeverageTokenContext.Provider>
  )
}
