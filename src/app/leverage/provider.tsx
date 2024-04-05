import { BigNumber } from 'ethers'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { TransactionReview } from '@/components/swap/components/transaction-review/types'
import {
  BTC,
  ETH,
  IndexCoopEthereum2xIndex,
  Token,
  USDC,
} from '@/constants/tokens'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { IndexApi } from '@/lib/utils/api/index-api'
import { getDefaultIndex } from '@/lib/utils/tokens'

import { BaseTokenStats } from './types'

export enum LeverageType {
  Long2x,
  Long3x,
  Short,
}

export interface TokenContext {
  isMinting: boolean
  leverageType: LeverageType
  inputToken: Token
  outputToken: Token
  stats: BaseTokenStats | null
  transactionReview: TransactionReview | null
  onSelectLeverageType: (type: LeverageType) => void
  toggleIsMinting: () => void
}

export const LeverageTokenContext = createContext<TokenContext>({
  isMinting: true,
  leverageType: LeverageType.Long2x,
  inputToken: ETH,
  outputToken: getDefaultIndex(),
  stats: null,
  transactionReview: null,
  onSelectLeverageType: () => {},
  toggleIsMinting: () => {},
})

export const useLeverageToken = () => useContext(LeverageTokenContext)

export function LeverageProvider(props: { children: any }) {
  const isFetchingQuote = false
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
      gasCostsInUsd: 0,
      fullCostsInUsd: 0,
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
  const [isMinting, setMinting] = useState<boolean>(true)
  // TODO:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputToken, setInputToken] = useState<Token>(USDC)
  // TODO:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [outputToken, setOutputToken] = useState<Token>(BTC)
  const [leverageType, setLeverageType] = useState<LeverageType>(
    LeverageType.Long2x,
  )
  const [stats, setStats] = useState<BaseTokenStats | null>(null)

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

  const onSelectLeverageType = (type: LeverageType) => {
    setLeverageType(type)
  }

  return (
    <LeverageTokenContext.Provider
      value={{
        isMinting,
        leverageType,
        inputToken,
        outputToken,
        stats,
        transactionReview,
        onSelectLeverageType,
        toggleIsMinting,
      }}
    >
      {props.children}
    </LeverageTokenContext.Provider>
  )
}
