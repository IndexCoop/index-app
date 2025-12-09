import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { PostApiV2Trade200 } from '@/gen'
import { saveTrade } from '@/lib/actions/trade'
import { formatQuoteAnalytics, useAnalytics } from '@/lib/hooks/use-analytics'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { TradeCallback, useTrade } from '@/lib/hooks/use-trade'
import { useUtmParams } from '@/lib/hooks/use-utm-params'
import { tradeMachineAtom } from '@/lib/store/trade-machine'
import { formatAmountFromWei } from '@/lib/utils'
import { mapQuoteToTrade } from '@/lib/utils/api/database'
import { getBlockExplorerContractUrl } from '@/lib/utils/block-explorer'

import { ReviewProps } from './components/review'
import { TransactionReviewSimulationState } from './components/simulation'

export function useTransactionReview(props: ReviewProps) {
  const decimals = 10
  const { onSubmitWithSuccess, transactionReview } = props
  const { logEvent } = useAnalytics()
  const { executeTrade, isTransacting } = useTrade()
  const { quoteResults, selectedQuote } = transactionReview

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [override, setOverride] = useState(false)
  const [simulationState, setSimulationState] =
    useState<TransactionReviewSimulationState>(
      TransactionReviewSimulationState.default,
    )

  useEffect(() => {
    logEvent('Transaction Review', formatQuoteAnalytics(quote))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setOverride(false)
    // Reset state for new data
    setSimulationState(TransactionReviewSimulationState.default)
  }, [transactionReview])

  useEffect(() => {
    if (simulationState === TransactionReviewSimulationState.loading) {
      setIsButtonDisabled(true)
      return
    }

    if (
      !override &&
      simulationState === TransactionReviewSimulationState.failure
    ) {
      setIsButtonDisabled(true)
      return
    }

    setIsButtonDisabled(false)
  }, [override, simulationState])

  useEffect(() => {
    setIsLoading(isTransacting)
  }, [isTransacting])

  const contractBlockExplorerUrl = useMemo(
    () =>
      getBlockExplorerContractUrl(
        transactionReview.contractAddress,
        transactionReview.chainId,
      ),
    [transactionReview],
  )

  const formattedInputTokenAmount = formatAmountFromWei(
    transactionReview.inputTokenAmount,
    transactionReview.inputToken.decimals,
    decimals,
  )
  const formattedOutputTokenAmount = formatAmountFromWei(
    transactionReview.outputTokenAmount,
    transactionReview.outputToken.decimals,
    decimals,
  )

  const quote = useMemo(() => {
    if (selectedQuote === QuoteType.flashmint) {
      return quoteResults.results.flashmint!.quote
    }
    if (selectedQuote === QuoteType.issuance) {
      return quoteResults.results.issuance!.quote
    }
    if (selectedQuote === QuoteType.redemption) {
      return quoteResults.results.redemption!.quote
    }
    return quoteResults.results.index!.quote
  }, [quoteResults, selectedQuote])

  const shouldShowOverride = useMemo(
    () => simulationState === TransactionReviewSimulationState.failure,
    [simulationState],
  )

  const sendTradeEvent = useSetAtom(tradeMachineAtom)

  const utm = useUtmParams()

  const queryClient = useQueryClient()
  const saveTradeCallback: TradeCallback = useCallback(
    async ({ address, hash, quote }) => {
      const { data: result, status } = await saveTrade(
        mapQuoteToTrade(address, hash, quote, utm),
      )

      await queryClient.refetchQueries({
        predicate: (query) =>
          (query.queryKey[0] as string)?.includes('leverage-token') ||
          (query.queryKey[0] as string)?.includes('balances') ||
          (query.queryKey[0] as string)?.includes('raffle-tickets'),
      })

      if (status === 200 && result) {
        sendTradeEvent({
          type: 'TRADE_SUCCESS',
          result: result as PostApiV2Trade200,
        })
      } else {
        sendTradeEvent({ type: 'TRADE_FAILED' })
      }
    },
    [utm, queryClient, sendTradeEvent],
  )

  const makeTrade = async (override: boolean) => {
    if (!quote) return null
    try {
      await executeTrade(quote, override, saveTradeCallback)

      return true
    } catch {
      sendTradeEvent({ type: 'CLOSE' })
      return false
    }
  }

  const onChangeOverride = (isChecked: boolean) => {
    setOverride(isChecked)
  }

  const onSubmit = async () => {
    // if (!override) {
    //   setSimulationState(TransactionReviewSimulationState.loading)
    //   const isSuccess = await simulateTrade()
    //   const state = isSuccess
    //     ? TransactionReviewSimulationState.success
    //     : TransactionReviewSimulationState.failure
    //   setSimulationState(state)
    //   if (!isSuccess) return
    // }
    const success = await makeTrade(override)
    setOverride(false)
    if (success === null) return
    onSubmitWithSuccess(success)
  }

  return {
    contractBlockExplorerUrl,
    formattedInputTokenAmount,
    formattedOutputTokenAmount,
    isButtonDisabled,
    isLoading,
    shouldShowOverride,
    simulationState,
    onChangeOverride,
    onSubmit,
    override,
  }
}
