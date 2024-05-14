'use client'

import { ChainId, UiPoolDataProvider } from '@aave/contract-helpers'
import { formatReserves } from '@aave/math-utils'
import { AaveV3Ethereum } from '@bgd-labs/aave-address-book'
import { BigNumber, providers } from 'ethers'
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
import { ARBITRUM } from '@/constants/chains'
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
import { getFlashMintQuote } from '@/lib/hooks/use-best-quote/utils/flashmint'
import { useNetwork } from '@/lib/hooks/use-network'
import { getTokenPrice, useNativeTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/use-wallet'
import { isValidTokenInput, parseUnits } from '@/lib/utils'
import { IndexApi } from '@/lib/utils/api/index-api'

import { BaseTokenStats } from './types'

const baseTokens = [ETH, BTC]
const currencyTokens = [ETH, WETH, WBTC, USDC, USDT]

export enum LeverageType {
  Long2x,
  Long3x,
  Short,
}

export interface TokenContext {
  inputValue: string
  isMinting: boolean
  leverageType: LeverageType
  baseToken: Token
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  baseTokens: Token[]
  currencyTokens: Token[]
  costOfCarry: number | null
  inputTokens: Token[]
  outputTokens: Token[]
  isFetchingQuote: boolean
  quoteResult: QuoteResult | null
  stats: BaseTokenStats | null
  transactionReview: TransactionReview | null
  onChangeInputTokenAmount: (input: string) => void
  onSelectBaseToken: (tokenSymbol: string) => void
  onSelectInputToken: (tokenSymbol: string) => void
  onSelectLeverageType: (type: LeverageType) => void
  onSelectOutputToken: (tokenSymbol: string) => void
  reset: () => void
  toggleIsMinting: () => void
}

export const LeverageTokenContext = createContext<TokenContext>({
  inputValue: '',
  isMinting: true,
  leverageType: LeverageType.Long2x,
  baseToken: ETH,
  inputToken: ETH,
  outputToken: IndexCoopEthereum2xIndex,
  inputTokenAmount: BigInt(0),
  baseTokens,
  currencyTokens,
  costOfCarry: null,
  inputTokens: [],
  outputTokens: [],
  isFetchingQuote: false,
  quoteResult: null,
  stats: null,
  transactionReview: null,
  onChangeInputTokenAmount: () => {},
  onSelectBaseToken: () => {},
  onSelectInputToken: () => {},
  onSelectLeverageType: () => {},
  onSelectOutputToken: () => {},
  reset: () => {},
  toggleIsMinting: () => {},
})

export const useLeverageToken = () => useContext(LeverageTokenContext)

function getLeverageType(token: Token): LeverageType | null {
  switch (token.symbol) {
    case IndexCoopBitcoin2xIndex.symbol:
    case IndexCoopEthereum2xIndex.symbol:
      return LeverageType.Long2x
    case IndexCoopBitcoin3xIndex.symbol:
    case IndexCoopEthereum3xIndex.symbol:
      return LeverageType.Long3x
    case IndexCoopInverseBitcoinIndex.symbol:
    case IndexCoopInverseEthereumIndex.symbol:
      return LeverageType.Short
    default:
      return null
  }
}

export function LeverageProvider(props: { children: any }) {
  const publicClient = usePublicClient()
  const { chainId } = useNetwork()
  const nativeTokenPrice = useNativeTokenPrice(chainId)
  const { address, provider, jsonRpcProvider } = useWallet()

  const [inputValue, setInputValue] = useState('')
  const [costOfCarry, setCostOfCarry] = useState<number | null>(null)
  const [isFetchingQuote, setFetchingQuote] = useState(false)
  const [isMinting, setMinting] = useState<boolean>(true)
  const [inputToken, setInputToken] = useState<Token>(ETH)
  const [outputToken, setOutputToken] = useState<Token>(
    IndexCoopInverseEthereumIndex,
  )
  const [baseToken, setBaseToken] = useState<Token>(ETH)
  const [leverageType, setLeverageType] = useState<LeverageType>(
    LeverageType.Long2x,
  )
  const [stats, setStats] = useState<BaseTokenStats | null>(null)
  const [quoteResult, setQuoteResult] = useState<QuoteResult>({
    type: QuoteType.flashmint,
    isAvailable: true,
    quote: null,
    error: null,
  })

  const indexToken = useMemo(() => {
    if (isMinting) return outputToken
    return inputToken
  }, [inputToken, isMinting, outputToken])

  const indexTokenBasedOnLeverageType = useMemo(() => {
    if (baseToken.symbol === 'ETH') {
      switch (leverageType) {
        case LeverageType.Long2x:
          return IndexCoopEthereum2xIndex
        case LeverageType.Long3x:
          return IndexCoopEthereum3xIndex
        case LeverageType.Short:
          return IndexCoopInverseEthereumIndex
      }
    } else {
      switch (leverageType) {
        case LeverageType.Long2x:
          return IndexCoopBitcoin2xIndex
        case LeverageType.Long3x:
          return IndexCoopBitcoin3xIndex
        case LeverageType.Short:
          return IndexCoopInverseBitcoinIndex
      }
    }
  }, [baseToken, leverageType])

  const indexTokensBasedOnSymbol = useMemo(() => {
    if (baseToken.symbol === 'ETH') {
      return [
        IndexCoopInverseEthereumIndex,
        IndexCoopEthereum2xIndex,
        IndexCoopEthereum3xIndex,
      ]
    }
    return [
      IndexCoopInverseBitcoinIndex,
      IndexCoopBitcoin2xIndex,
      IndexCoopBitcoin3xIndex,
    ]
  }, [baseToken])

  const inputTokenAmount = useMemo(
    () =>
      inputValue === ''
        ? BigInt(0)
        : parseUnits(inputValue, inputToken.decimals),
    [inputToken, inputValue],
  )

  const inputTokens = useMemo(() => {
    if (isMinting) return currencyTokens
    return indexTokensBasedOnSymbol
  }, [indexTokensBasedOnSymbol, isMinting])

  const outputTokens = useMemo(() => {
    if (!isMinting) return currencyTokens
    return indexTokensBasedOnSymbol
  }, [indexTokensBasedOnSymbol, isMinting])

  const transactionReview = useMemo((): TransactionReview | null => {
    if (isFetchingQuote || quoteResult === null) return null
    const quote = quoteResult.quote
    if (quote) {
      return {
        ...quote,
        contractAddress: quote.contract,
        quoteResults: {
          bestQuote: QuoteType.flashmint,
          results: {
            flashmint: quoteResult,
            issuance: null,
            redemption: null,
            zeroex: null,
          },
        },
        selectedQuote: QuoteType.flashmint,
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
        const res = await indexApi.get(`/token/${baseToken.symbol}`)
        setStats(res.data)
      } catch (err) {
        console.log('Error fetching token stats', err)
      }
    }
    fetchStats()
  }, [baseToken])

  useEffect(() => {
    async function fetchCostOfCarry(
      jsonRpcProvider: providers.JsonRpcProvider,
    ) {
      try {
        const poolDataProviderContract = new UiPoolDataProvider({
          uiPoolDataProviderAddress: AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
          provider: jsonRpcProvider,
          chainId: ChainId.mainnet,
        })
        const reserves = await poolDataProviderContract.getReservesHumanized({
          lendingPoolAddressProvider: AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
        })

        const formattedPoolReserves = formatReserves({
          reserves: reserves.reservesData,
          currentTimestamp: Math.floor(Date.now() / 1000),
          marketReferenceCurrencyDecimals:
            reserves.baseCurrencyData.marketReferenceCurrencyDecimals,
          marketReferencePriceInUsd:
            reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
        })

        const borrowedAsset = formattedPoolReserves.find(
          (asset) =>
            asset.symbol.toLowerCase() === outputToken.borrowedAssetSymbol,
        )

        if (!borrowedAsset) {
          return
        }

        setCostOfCarry(
          Number(borrowedAsset.variableBorrowAPY) -
            Number(borrowedAsset.supplyAPY),
        )
      } catch (e) {
        console.error('Caught error while fetching borrow rates', e)
      }
    }

    if (!jsonRpcProvider || outputToken === null) return
    fetchCostOfCarry(jsonRpcProvider)
  }, [jsonRpcProvider, outputToken])

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

  const onSelectInputToken = useCallback(
    (tokenSymbol: string) => {
      const token = inputTokens.find((token) => token.symbol === tokenSymbol)
      if (!token) return
      setInputToken(token)
      const leverageType = getLeverageType(token)
      if (leverageType !== null) {
        setLeverageType(leverageType)
      }
    },
    [inputTokens],
  )

  const onSelectBaseToken = (tokenSymbol: string) => {
    const token = baseTokens.find((token) => token.symbol === tokenSymbol)
    if (!token) return
    setBaseToken(token)
  }

  const onSelectOutputToken = (tokenSymbol: string) => {
    const token = outputTokens.find((token) => token.symbol === tokenSymbol)
    if (!token) return
    setOutputToken(token)
    const leverageType = getLeverageType(token)
    if (leverageType !== null) {
      setLeverageType(leverageType)
    }
  }

  const reset = () => {
    setInputValue('')
    setQuoteResult({
      type: QuoteType.flashmint,
      isAvailable: true,
      quote: null,
      error: null,
    })
  }

  useEffect(() => {
    setInputToken(inputTokens[0])
  }, [inputTokens, isMinting])

  useEffect(() => {
    setOutputToken(outputTokens[0])
  }, [outputTokens, isMinting])

  useEffect(() => {
    const indexToken = indexTokenBasedOnLeverageType
    if (isMinting) {
      setOutputToken(indexToken)
      return
    }
    setInputToken(indexToken)
  }, [indexTokenBasedOnLeverageType, isMinting, leverageType])

  useEffect(() => {
    const fetchQuote = async () => {
      if (!address) return
      if (chainId !== ARBITRUM.chainId) return
      if (!jsonRpcProvider || !provider || !publicClient) return
      if (inputTokenAmount <= 0) return
      if (!indexToken) return
      console.log('index-token:', indexToken.symbol)
      setFetchingQuote(true)
      const inputTokenPrice = await getTokenPrice(inputToken, chainId)
      const outputTokenPrice = await getTokenPrice(outputToken, chainId)
      const gasPrice = await provider.getGasPrice()
      console.log(inputTokenPrice, outputTokenPrice, gasPrice.toString())
      // Might have to use getEnhancedFlashMintQuote instead
      const quoteFlashMint = await getFlashMintQuote(
        {
          isMinting,
          account: address,
          chainId,
          inputToken,
          inputTokenAmount: inputValue,
          inputTokenAmountWei: BigNumber.from(inputTokenAmount.toString()),
          inputTokenPrice,
          outputToken,
          outputTokenPrice,
          nativeTokenPrice,
          slippage: 0.1,
        },
        provider,
        jsonRpcProvider,
      )
      const quoteResult = {
        type: QuoteType.flashmint,
        isAvailable: true,
        quote: quoteFlashMint,
        error: null,
      }
      setFetchingQuote(false)
      setQuoteResult(quoteResult)
    }
    fetchQuote()
  }, [
    address,
    chainId,
    jsonRpcProvider,
    indexToken,
    inputToken,
    inputTokenAmount,
    inputValue,
    isMinting,
    nativeTokenPrice,
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
        baseToken,
        inputToken,
        outputToken,
        inputTokenAmount,
        baseTokens,
        costOfCarry,
        currencyTokens,
        inputTokens,
        outputTokens,
        isFetchingQuote,
        quoteResult,
        stats,
        transactionReview,
        onChangeInputTokenAmount,
        onSelectBaseToken,
        onSelectInputToken,
        onSelectLeverageType,
        onSelectOutputToken,
        reset,
        toggleIsMinting,
      }}
    >
      {props.children}
    </LeverageTokenContext.Provider>
  )
}
