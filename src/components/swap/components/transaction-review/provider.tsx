import { useEffect, useMemo, useState } from 'react'

import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useSimulateQuote } from '@/lib/hooks/use-simulate-quote'
import { useTrade } from '@/lib/hooks/use-trade'
import { displayFromWei } from '@/lib/utils'
import { getBlockExplorerContractUrl } from '@/lib/utils/block-explorer'

import { TransactionReviewSimulationState } from './components/simulation'
import { ReviewProps } from './'

export function useTransactionReview(props: ReviewProps) {
  const { onSubmitWithSuccess, transactionReview } = props
  const { executeTrade, isTransacting, txWouldFail } = useTrade()
  const { quoteResults, selectedQuote } = transactionReview

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [override, setOverride] = useState(false)
  const [simulationState, setSimulationState] =
    useState<TransactionReviewSimulationState>(
      TransactionReviewSimulationState.default,
    )

  useEffect(() => {
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

  const decimals = 10
  const formattedInputTokenAmount =
    displayFromWei(
      transactionReview.inputTokenAmount,
      decimals,
      transactionReview.inputToken.decimals,
    ) ?? ''
  const formattedOutputTokenAmount =
    displayFromWei(
      transactionReview.outputTokenAmount,
      decimals,
      transactionReview.outputToken.decimals,
    ) ?? ''

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
    return quoteResults.results.zeroex!.quote
  }, [quoteResults, selectedQuote])

  const shouldShowOverride = useMemo(
    () => simulationState === TransactionReviewSimulationState.failure,
    [simulationState],
  )

  const { simulateTrade } = useSimulateQuote(quote?.tx ?? null)

  const makeTrade = async (override: boolean) => {
    if (!quote) return null
    try {
      await executeTrade(quote, override)
      return true
    } catch {
      return false
    }
  }

  const onChangeOverride = (isChecked: boolean) => {
    setOverride(isChecked)
  }

  const onSubmit = async () => {
    setSimulationState(TransactionReviewSimulationState.loading)
    const isSuccess = await simulateTrade()
    const state = isSuccess
      ? TransactionReviewSimulationState.success
      : TransactionReviewSimulationState.failure
    setSimulationState(state)
    console.log('isSuccess', isSuccess)
    if (!isSuccess && !override) return
    const success = await makeTrade(override)
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
