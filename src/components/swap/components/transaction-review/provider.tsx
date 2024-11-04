import { useCallback, useEffect, useMemo, useState } from 'react'

import { formatQuoteAnalytics, useAnalytics } from '@/lib/hooks/use-analytics'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useSimulateQuote } from '@/lib/hooks/use-simulate-quote'
import { TradeCallback, useTrade } from '@/lib/hooks/use-trade'
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
    transactionReview.inputTokenAmount.toBigInt(),
    transactionReview.inputToken.decimals,
    decimals,
  )
  const formattedOutputTokenAmount = formatAmountFromWei(
    transactionReview.outputTokenAmount.toBigInt(),
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

  const { simulateTrade } = useSimulateQuote(quote?.tx ?? null)

  const saveUserTrade: TradeCallback = useCallback(
    async ({ address, hash, quote }) => {
      fetch(`/api/user/trade`, {
        method: 'POST',
        body: JSON.stringify(mapQuoteToTrade(address, hash, quote)),
      })
    },
    [],
  )

  const makeTrade = async (override: boolean) => {
    if (!quote) return null
    try {
      await executeTrade(quote, override, saveUserTrade)
      return true
    } catch {
      return false
    }
  }

  const onChangeOverride = (isChecked: boolean) => {
    setOverride(isChecked)
  }

  const onSubmit = async () => {
    if (!override) {
      setSimulationState(TransactionReviewSimulationState.loading)
      const isSuccess = await simulateTrade()
      const state = isSuccess
        ? TransactionReviewSimulationState.success
        : TransactionReviewSimulationState.failure
      setSimulationState(state)
      if (!isSuccess) return
    }
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
  }
}
