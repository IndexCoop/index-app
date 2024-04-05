'use client'

import { useDisclosure } from '@chakra-ui/react'

import { useLeverageToken } from '@/app/leverage/provider'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { TradeButton } from '@/components/trade-button'
import { Token } from '@/constants/tokens'

import { BuySellSelector } from './components/buy-sell-selector'
import { LeverageSelector } from './components/leverage-selector'
import { Summary } from './components/summary'

import './styles.css'

export function LeverageWidget() {
  const {
    inputToken,
    isMinting,
    leverageType,
    transactionReview,
    onSelectLeverageType,
    outputToken,
    toggleIsMinting,
  } = useLeverageToken()

  const {
    isOpen: isTransactionReviewOpen,
    onOpen: onOpenTransactionReview,
    onClose: onCloseTransactionReview,
  } = useDisclosure()

  const onChangeInput = (token: Token, amount: string) => {
    console.log(token.symbol, amount)
  }
  const onClickBalance = () => {}
  const onClickButton = () => {
    onOpenTransactionReview()
  }
  const onSelectToken = () => {}

  return (
    <div className='widget flex flex-col gap-3 rounded-3xl p-6'>
      <div>{outputToken.symbol}</div>
      <BuySellSelector isMinting={isMinting} onClick={toggleIsMinting} />
      <LeverageSelector
        selectedTye={leverageType}
        onSelectType={onSelectLeverageType}
      />
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={''}
        caption='You pay'
        formattedFiat={''}
        selectedToken={inputToken}
        selectedTokenAmount={''}
        onChangeInput={onChangeInput}
        onClickBalance={onClickBalance}
        onSelectToken={onSelectToken}
      />
      <Summary />
      <TradeButton
        label={'Connect wallet'}
        isDisabled={false}
        isLoading={false}
        onClick={onClickButton}
      />
      {transactionReview && (
        <TransactionReviewModal
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
