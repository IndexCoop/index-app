'use client'

import { useDisclosure } from '@chakra-ui/react'
import { useCallback, useEffect } from 'react'

import { Summary } from '@/app/earn/components/earn-widget/components/summary'
import { useEarnContext } from '@/app/earn/provider'
import { useQueryParams } from '@/app/earn/use-query-params'
import { Receive } from '@/components/receive'
import { BuySellSelector } from '@/components/selectors/buy-sell-selector'
import { Settings } from '@/components/settings'
import { SmartTradeButton } from '@/components/smart-trade-button'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { WarningType } from '@/components/swap/components/warning'
import { TradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { TokenDisplay } from '@/components/token-display'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSlippage } from '@/lib/providers/slippage'
import { formatWei } from '@/lib/utils'

import { useFormattedEarnData } from '../../use-formatted-data'

import './styles.css'

const hiddenLeverageWarnings = [WarningType.flashbots]

export function EarnWidget() {
  const { queryParams } = useQueryParams()
  const { address } = useWallet()
  const {
    indexToken,
    inputToken,
    inputTokenAmount,
    inputTokens,
    inputValue,
    isMinting,
    outputTokens,
    transactionReview,
    onChangeInputTokenAmount,
    onSelectInputToken,
    onSelectOutputToken,
    outputToken,
    reset,
    toggleIsMinting,
  } = useEarnContext()

  const {
    contract,
    hasInsufficientFunds,
    inputAmoutUsd,
    inputBalance,
    inputBalanceFormatted,
    isFetchingQuote,
    ouputAmount,
    resetData,
  } = useFormattedEarnData()

  const {
    isOpen: isSelectInputTokenOpen,
    onOpen: onOpenSelectInputToken,
    onClose: onCloseSelectInputToken,
  } = useDisclosure()
  const {
    isOpen: isSelectOutputTokenOpen,
    onOpen: onOpenSelectOutputToken,
    onClose: onCloseSelectOutputToken,
  } = useDisclosure()
  const {
    isOpen: isTransactionReviewOpen,
    onOpen: onOpenTransactionReview,
    onClose: onCloseTransactionReview,
  } = useDisclosure()

  const {
    auto: autoSlippage,
    isAuto: isAutoSlippage,
    set: setSlippage,
    setSlippageForToken,
    slippage,
  } = useSlippage()

  const onClickBalance = useCallback(() => {
    if (!inputBalance) return
    onChangeInputTokenAmount(formatWei(inputBalance, inputToken.decimals))
  }, [inputBalance, inputToken, onChangeInputTokenAmount])

  useEffect(() => {
    setSlippageForToken(isMinting ? outputToken.symbol : inputToken.symbol)
  }, [inputToken, isMinting, outputToken, setSlippageForToken])

  return (
    <div className='earn-widget flex h-fit flex-col gap-3 rounded-lg px-4 py-6 lg:ml-auto'>
      <div className='flex justify-between'>
        <TokenDisplay mini token={indexToken} />
        <Settings
          isAuto={isAutoSlippage}
          isDarkMode={false}
          slippage={slippage}
          onChangeSlippage={setSlippage}
          onClickAuto={autoSlippage}
        />
      </div>
      <BuySellSelector isMinting={isMinting} onClick={toggleIsMinting} />
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={inputBalanceFormatted}
        caption='You pay'
        formattedFiat={inputAmoutUsd}
        selectedToken={inputToken}
        selectedTokenAmount={inputValue}
        onChangeInput={(_, amount) => onChangeInputTokenAmount(amount)}
        onClickBalance={onClickBalance}
        onSelectToken={onOpenSelectInputToken}
      />
      <Receive
        isLoading={isFetchingQuote}
        outputAmount={ouputAmount}
        selectedOutputToken={outputToken}
        onSelectToken={onOpenSelectOutputToken}
      />
      <Summary />
      <SmartTradeButton
        contract={contract ?? ''}
        hasFetchingError={false}
        hasInsufficientFunds={hasInsufficientFunds}
        hiddenWarnings={hiddenLeverageWarnings}
        inputTokenAmount={inputTokenAmount}
        inputToken={inputToken}
        inputValue={inputValue}
        isFetchingQuote={isFetchingQuote}
        queryNetwork={queryParams.queryNetwork}
        outputToken={outputToken}
        buttonLabelOverrides={{
          [TradeButtonState.default]: 'Review Transaction',
        }}
        onOpenTransactionReview={onOpenTransactionReview}
        onRefetchQuote={() => {}}
      />
      <SelectTokenModal
        isOpen={isSelectInputTokenOpen}
        onClose={onCloseSelectInputToken}
        onSelectedToken={(tokenSymbol, chainId) => {
          onSelectInputToken(tokenSymbol, chainId)
          onCloseSelectInputToken()
        }}
        address={address}
        tokens={inputTokens}
        showNetworks={!isMinting}
      />
      <SelectTokenModal
        isOpen={isSelectOutputTokenOpen}
        onClose={onCloseSelectOutputToken}
        onSelectedToken={(tokenSymbol, chainId) => {
          onSelectOutputToken(tokenSymbol, chainId)
          onCloseSelectOutputToken()
        }}
        address={address}
        tokens={outputTokens}
        showNetworks={isMinting}
      />
      {transactionReview && (
        <TransactionReviewModal
          isOpen={isTransactionReviewOpen}
          onClose={() => {
            reset()
            resetData()
            onCloseTransactionReview()
          }}
          transactionReview={transactionReview}
        />
      )}
    </div>
  )
}
