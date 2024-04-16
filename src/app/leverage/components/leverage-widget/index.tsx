'use client'

import { useDisclosure } from '@chakra-ui/react'
import { useCallback } from 'react'

import { useLeverageToken } from '@/app/leverage/provider'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import { useTradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatWei } from '@/lib/utils'

import { useFormattedLeverageData } from '../../use-formatted-data'

import { BuySellSelector } from './components/buy-sell-selector'
import { LeverageSelector } from './components/leverage-selector'
import { Summary } from './components/summary'

import './styles.css'

export function LeverageWidget() {
  const { address } = useWallet()
  const {
    currencyTokens,
    indexTokens,
    inputToken,
    inputValue,
    isMinting,
    leverageType,
    stats,
    transactionReview,
    onChangeInputTokenAmount,
    onSelectCurrencyToken,
    onSelectIndexToken,
    onSelectLeverageType,
    outputToken,
    toggleIsMinting,
  } = useLeverageToken()

  const { inputBalance, inputBalanceFormatted, isFetchingQuote } =
    useFormattedLeverageData(stats)

  const {
    isOpen: isSelectIndexTokenOpen,
    onOpen: onOpenSelectIndexToken,
    onClose: onCloseSelectIndexToken,
  } = useDisclosure()
  const {
    isOpen: isSelectCurrencyTokenOpen,
    onOpen: onOpenSelectCurrencyToken,
    onClose: onCloseSelectCurrencyToken,
  } = useDisclosure()
  const {
    isOpen: isTransactionReviewOpen,
    onOpen: onOpenTransactionReview,
    onClose: onCloseTransactionReview,
  } = useDisclosure()

  const isApproved = true
  const isApproving = false
  const hasInsufficientFunds = false
  const shouldApprove = true
  const buttonState = useTradeButtonState(
    false,
    hasInsufficientFunds,
    shouldApprove,
    isApproved,
    isApproving,
    outputToken,
    inputValue,
  )
  const { buttonLabel, isDisabled } = useTradeButton(buttonState)

  const onClickBalance = useCallback(() => {
    if (!inputBalance) return
    onChangeInputTokenAmount(formatWei(inputBalance, inputToken.decimals))
  }, [inputBalance, inputToken, onChangeInputTokenAmount])

  const onClickButton = () => {
    onOpenTransactionReview()
  }

  return (
    <div className='widget flex flex-col gap-3 rounded-3xl p-6'>
      <div className='cursor-pointer' onClick={onOpenSelectIndexToken}>
        {outputToken.symbol}
      </div>
      <BuySellSelector isMinting={isMinting} onClick={toggleIsMinting} />
      <LeverageSelector
        selectedTye={leverageType}
        onSelectType={onSelectLeverageType}
      />
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={inputBalanceFormatted}
        caption='You pay'
        formattedFiat={''}
        selectedToken={inputToken}
        selectedTokenAmount={inputValue}
        onChangeInput={(_, amount) => onChangeInputTokenAmount(amount)}
        onClickBalance={onClickBalance}
        onSelectToken={onOpenSelectCurrencyToken}
      />
      <Summary />
      <TradeButton
        label={buttonLabel}
        isDisabled={isDisabled}
        isLoading={isFetchingQuote}
        onClick={onClickButton}
      />
      <SelectTokenModal
        isDarkMode={true}
        isOpen={isSelectIndexTokenOpen}
        showBalances={false}
        onClose={onCloseSelectIndexToken}
        onSelectedToken={(tokenSymbol) => {
          onSelectIndexToken(tokenSymbol)
          onCloseSelectIndexToken()
        }}
        address={address}
        tokens={indexTokens}
      />
      <SelectTokenModal
        isDarkMode={true}
        isOpen={isSelectCurrencyTokenOpen}
        onClose={onCloseSelectCurrencyToken}
        onSelectedToken={(tokenSymbol) => {
          onSelectCurrencyToken(tokenSymbol)
          onCloseSelectCurrencyToken()
        }}
        address={address}
        tokens={currencyTokens}
      />
      {transactionReview && (
        <TransactionReviewModal
          isDarkMode={true}
          isOpen={isTransactionReviewOpen}
          onClose={() => {
            // reset()
            // forceRefetch()
            onCloseTransactionReview()
          }}
          transactionReview={transactionReview}
        />
      )}
    </div>
  )
}
