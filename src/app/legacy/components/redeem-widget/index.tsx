'use client'

import { useDisclosure } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useCallback, useMemo } from 'react'

import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { TransactionReview } from '@/components/swap/components/transaction-review/types'
import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import {
  TradeButtonState,
  useTradeButtonState,
} from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { useApproval } from '@/lib/hooks/use-approval'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useMainnetOnly } from '@/lib/hooks/use-network'
import { formatWei } from '@/lib/utils'

import { useRedeem } from '../../providers/redeem-provider'

import { DepositWithdrawSelector } from './components/deposit-withdraw-selector'
import { Summary } from './components/summary'
import { TitleLogo } from './components/title-logo'
import { useFormattedData } from './use-formatted-data'

import './styles.css'

export function RedeemWidget() {
  const isSupportedNetwork = useMainnetOnly()
  const { openConnectModal } = useConnectModal()
  const {
    inputValue,
    inputToken,
    inputTokenAmount,
    isDepositing,
    isFetchingQuote,
    onChangeInputTokenAmount,
    outputToken,
    quoteResult,
    reset,
  } = useRedeem()
  const {
    hasInsufficientFunds,
    inputAmoutUsd,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    forceRefetch,
  } = useFormattedData()

  const {
    isApproved,
    isApproving,
    approve: onApprove,
  } = useApproval(
    inputToken,
    '0x04b59F9F09750C044D7CfbC177561E409085f0f3',
    inputTokenAmount,
  )

  const {
    isOpen: isTransactionReviewOpen,
    onOpen: onOpenTransactionReview,
    onClose: onCloseTransactionReview,
  } = useDisclosure()

  const shouldApprove = true
  const buttonState = useTradeButtonState(
    isSupportedNetwork,
    false,
    hasInsufficientFunds,
    shouldApprove,
    isApproved,
    isApproving,
    outputToken,
    inputValue,
  )
  const { buttonLabel, isDisabled } = useTradeButton(buttonState)

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

  const onClickBalance = useCallback(() => {
    if (!inputTokenBalance) return
    onChangeInputTokenAmount(formatWei(inputTokenBalance, 18))
  }, [inputTokenBalance, onChangeInputTokenAmount])

  const onClickButton = useCallback(async () => {
    if (buttonState === TradeButtonState.connectWallet) {
      if (openConnectModal) {
        openConnectModal()
      }
      return
    }

    // if (buttonState === TradeButtonState.fetchingError) {
    //   fetchOptions()
    //   return
    // }

    if (buttonState === TradeButtonState.insufficientFunds) return

    if (!isApproved && shouldApprove) {
      await onApprove()
      return
    }

    if (buttonState === TradeButtonState.default) {
      onOpenTransactionReview()
    }
  }, [
    buttonState,
    isApproved,
    onApprove,
    onOpenTransactionReview,
    openConnectModal,
    shouldApprove,
  ])

  const onSelectToken = () => {}

  return (
    <div className='widget w-full min-w-80 flex-1 flex-col space-y-4 rounded-3xl p-6'>
      <TitleLogo logo={inputToken.image ?? ''} symbol={inputToken.symbol} />
      <DepositWithdrawSelector isDepositing={isDepositing} onClick={() => {}} />
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={inputTokenBalanceFormatted}
        caption='You pay'
        formattedFiat={inputAmoutUsd}
        selectedToken={inputToken}
        selectedTokenAmount={inputValue}
        onChangeInput={(_, amount) => onChangeInputTokenAmount(amount)}
        onClickBalance={onClickBalance}
        onSelectToken={onSelectToken}
      />
      <Summary />
      <TradeButton
        label={buttonLabel}
        isDisabled={isDisabled}
        isLoading={isFetchingQuote}
        onClick={onClickButton}
      />
      {transactionReview && (
        <TransactionReviewModal
          isOpen={isTransactionReviewOpen}
          onClose={() => {
            reset()
            forceRefetch()
            onCloseTransactionReview()
          }}
          transactionReview={transactionReview}
        />
      )}
    </div>
  )
}
