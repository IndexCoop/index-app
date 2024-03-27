'use client'

import { BigNumber } from 'ethers'

import { useDisclosure } from '@chakra-ui/react'

import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import { useTradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { ETH } from '@/constants/tokens'
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
    toggleIsDepositing,
  } = useDeposit()
  const { currencyBalance, inputAmoutUsd, tvl, userBalance } =
    useFormattedData()

  const {
    isOpen: isTransactionReviewOpen,
    onOpen: onOpenTransactionReview,
    onClose: onCloseTransactionReview,
  } = useDisclosure()

  // TODO:
  const hasInsufficientFunds = false
  const shouldApprove = true

  // TODO: approvals
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

  // TODO: temporary placeholder delete once we have a quote
  const transactionReview = {
    chainId: 1,
    isMinting: true,
    inputToken: ETH,
    outputToken: ETH,
    inputTokenAmount: BigNumber.from(0),
    outputTokenAmount: BigNumber.from(0),
    slippage: 1,
    contractAddress: 'quote.contract',
    quoteResults: {
      bestQuote: QuoteType.redemption,
      results: {
        flashmint: null,
        issuance: null,
        redemption: null,
        zeroex: null,
      },
    },
    selectedQuote: QuoteType.redemption,
  }

  const onClickBalance = () => {
    // TODO:
  }
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
