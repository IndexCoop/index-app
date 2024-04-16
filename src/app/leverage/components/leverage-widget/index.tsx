'use client'

import { useDisclosure } from '@chakra-ui/react'

import { useLeverageToken } from '@/app/leverage/provider'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { TradeButton } from '@/components/trade-button'
import { Token } from '@/constants/tokens'
import { useWallet } from '@/lib/hooks/use-wallet'

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
    isMinting,
    leverageType,
    transactionReview,
    onSelectLeverageType,
    outputToken,
    toggleIsMinting,
  } = useLeverageToken()

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
        balance={''}
        caption='You pay'
        formattedFiat={''}
        selectedToken={inputToken}
        selectedTokenAmount={''}
        onChangeInput={onChangeInput}
        onClickBalance={onClickBalance}
        onSelectToken={onOpenSelectCurrencyToken}
      />
      <Summary />
      <TradeButton
        label={'Connect wallet'}
        isDisabled={false}
        isLoading={false}
        onClick={onClickButton}
      />
      <SelectTokenModal
        isOpen={isSelectIndexTokenOpen}
        onClose={onCloseSelectIndexToken}
        onSelectedToken={(tokenSymbol) => {
          // TODO: select token
          // selectInputToken(getTokenBySymbol(tokenSymbol)!)
          onCloseSelectIndexToken()
        }}
        address={address}
        tokens={indexTokens}
      />
      <SelectTokenModal
        isOpen={isSelectCurrencyTokenOpen}
        onClose={onCloseSelectCurrencyToken}
        onSelectedToken={(tokenSymbol) => {
          // TODO: select token
          // selectOutputToken(getTokenBySymbol(tokenSymbol)!)
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
