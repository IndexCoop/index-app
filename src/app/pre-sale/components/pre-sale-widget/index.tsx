'use client'

import { useCallback, useMemo } from 'react'
import { formatUnits } from 'viem'

import { useDisclosure } from '@chakra-ui/react'

import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { TransactionReview } from '@/components/swap/components/transaction-review/types'
import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import { useTradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'

import { useDeposit } from '../../providers/deposit-provider'
import { PreSaleToken } from '../../types'

import { DepositWithdrawSelector } from './components/deposit-withdraw-selector'
import { DepositStats } from './components/deposit-stats'
import { TitleLogo } from './components/title-logo'
import { useFormattedData } from './use-formatted-data'

import './styles.css'

export function PreSaleWidget({ token }: { token: PreSaleToken }) {
  const {
    inputValue,
    isDepositing,
    isFetchingQuote,
    preSaleCurrencyToken,
    onChangeInputTokenAmount,
    outputToken,
    quoteResult,
    toggleIsDepositing,
  } = useDeposit()
  const {
    currencyBalance,
    hasInsufficientFunds,
    inputAmoutUsd,
    inputTokenBalance,
    tvl,
    userBalance,
  } = useFormattedData()

  const {
    isOpen: isTransactionReviewOpen,
    onOpen: onOpenTransactionReview,
    onClose: onCloseTransactionReview,
  } = useDisclosure()

  // TODO: approvals
  const shouldApprove = true
  const isApprovedForSwap = true
  const isApprovingForSwap = false

  const buttonState = useTradeButtonState(
    false,
    hasInsufficientFunds,
    shouldApprove,
    isApprovedForSwap,
    isApprovingForSwap,
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
    onChangeInputTokenAmount(formatUnits(inputTokenBalance, 18))
  }, [inputTokenBalance, onChangeInputTokenAmount])

  const onClickButton = () => {
    onOpenTransactionReview()
  }

  const onSelectToken = () => {}

  return (
    <div className='widget w-full min-w-80 flex-1 flex-col space-y-4 rounded-3xl p-6'>
      <TitleLogo logo={token.logo ?? ''} symbol={token.symbol} />
      <DepositWithdrawSelector
        isDepositing={isDepositing}
        onClick={toggleIsDepositing}
      />
      <DepositStats tvl={tvl} userBalance={userBalance} />
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={currencyBalance}
        caption='You pay'
        formattedFiat={inputAmoutUsd}
        selectedToken={preSaleCurrencyToken}
        selectedTokenAmount={inputValue}
        onChangeInput={(_, amount) => onChangeInputTokenAmount(amount)}
        onClickBalance={onClickBalance}
        onSelectToken={onSelectToken}
      />
      <div>Summary</div>
      <TradeButton
        label={buttonLabel}
        isDisabled={isDisabled}
        isLoading={isFetchingQuote}
        onClick={onClickButton}
      />
      {transactionReview && (
        <TransactionReviewModal
          isOpen={isTransactionReviewOpen}
          onClose={onCloseTransactionReview}
          transactionReview={transactionReview}
        />
      )}
    </div>
  )
}
