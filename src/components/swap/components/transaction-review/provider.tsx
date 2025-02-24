import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePublicClient } from 'wagmi'

import { formatQuoteAnalytics, useAnalytics } from '@/lib/hooks/use-analytics'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { TradeCallback, useTrade } from '@/lib/hooks/use-trade'
import { useUtmParams } from '@/lib/hooks/use-utm-params'
import { formatAmountFromWei } from '@/lib/utils'
import { mapQuoteToTrade } from '@/lib/utils/api/database'
import { getBlockExplorerContractUrl } from '@/lib/utils/block-explorer'

import { tradeAtom } from '@/app/store/trade-atom'
import { PostApiV2Trade200 } from '@/gen'
import { captureException, captureMessage } from '@sentry/nextjs'
import { useSetAtom } from 'jotai'
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

  // const { simulateTrade } = useSimulateQuote(quote?.tx ?? null)

  const setLatestTrade = useSetAtom(tradeAtom)

  const utm = useUtmParams()

  const client = usePublicClient()
  const queryClient = useQueryClient()
  const saveTrade: TradeCallback = useCallback(
    async ({ address, hash, quote }) => {
      const trade = mapQuoteToTrade(address, hash, quote, utm)

      const response = await fetch(`/api/user/trade`, {
        method: 'POST',
        body: JSON.stringify(trade),
      })

      const data = await response.json()

      if (response.ok && response.status === 200) {
        const saveTradeResponse = data as PostApiV2Trade200

        setLatestTrade({
          ...saveTradeResponse,
          status: 'pending',
        })

        const rc = await client?.waitForTransactionReceipt({
          hash: hash as `0x${string}`,
          confirmations: 3,
        })

        setLatestTrade({
          ...saveTradeResponse,
          status: rc?.status ?? 'unknown',
        })

        queryClient.refetchQueries({
          predicate: (query) =>
            (query.queryKey[0] as string)?.includes('leverage-token') ||
            (query.queryKey[0] === 'balances' &&
              query.queryKey[1] === quote.chainId),
        })
      } else if (response.ok && response.status === 204) {
        captureMessage(
          `The ${trade.transactionHash} trade was not saved, as it reverted onchain.`,
        )
      } else {
        captureException(new Error(data.message), {
          extra: { trade, message: 'Failed to save trade into the database.' },
        })
      }
    },
    [utm, client, queryClient],
  )

  const makeTrade = async (override: boolean) => {
    if (!quote) return null
    try {
      await executeTrade(quote, override, saveTrade)
      return true
    } catch {
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
  }
}
