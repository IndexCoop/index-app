'use client'

import { useDisclosure } from '@chakra-ui/react'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useCallback, useMemo } from 'react'

import { useLeverageToken } from '@/app/leverage/provider'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { SignTermsModal } from '@/components/swap/components/sign-terms-modal'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import {
  TradeButtonState,
  useTradeButtonState,
} from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { useApproval } from '@/lib/hooks/use-approval'
import { useArbitrumOnly } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSignTerms } from '@/lib/providers/sign-terms-provider'
import { formatWei } from '@/lib/utils'

import { useFormattedLeverageData } from '../../use-formatted-data'

import { BuySellSelector } from './components/buy-sell-selector'
import { Fees } from './components/fees'
import { LeverageSelector } from './components/leverage-selector'
import { Summary } from './components/summary'

import './styles.css'

export function LeverageWidget() {
  const isSupportedNetwork = useArbitrumOnly()
  const { openChainModal } = useChainModal()
  const { openConnectModal } = useConnectModal()
  const { address } = useWallet()
  const { onOpenSignTermsModal } = useSignTerms()
  const {
    currencyTokens,
    indexTokens,
    inputToken,
    inputTokenAmount,
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
    isApproved,
    isApproving,
    approve: onApprove,
  } = useApproval(
    inputToken,
    // FIXME: change to correct FlashMint contract
    '0x04b59F9F09750C044D7CfbC177561E409085f0f3',
    inputTokenAmount,
  )

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

  // TODO:
  const hasInsufficientFunds = false
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
  const { buttonLabel: generatedButtonLabel, isDisabled } =
    useTradeButton(buttonState)

  const buttonLabel = useMemo(() => {
    if (buttonState === TradeButtonState.default) return 'Review Transaction'
    return generatedButtonLabel
  }, [buttonState, generatedButtonLabel])

  const onClickBalance = useCallback(() => {
    if (!inputBalance) return
    onChangeInputTokenAmount(formatWei(inputBalance, inputToken.decimals))
  }, [inputBalance, inputToken, onChangeInputTokenAmount])

  const onClickButton = async () => {
    if (buttonState === TradeButtonState.connectWallet) {
      if (openConnectModal) {
        openConnectModal()
      }
      return
    }
    if (buttonState === TradeButtonState.signTerms) {
      onOpenSignTermsModal()
      return
    }
    if (buttonState === TradeButtonState.wrongNetwork) {
      if (openChainModal) {
        openChainModal()
      }
      return
    }

    if (buttonState === TradeButtonState.insufficientFunds) return

    if (!isApproved && shouldApprove) {
      await onApprove()
      return
    }

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
      <Fees />
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
      <SignTermsModal />
    </div>
  )
}
