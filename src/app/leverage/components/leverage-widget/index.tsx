'use client'

import { useCallback } from 'react'

import { supportedNetworks } from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { Receive } from '@/components/receive'
import { Settings } from '@/components/settings'
import { SmartTradeButton } from '@/components/smart-trade-button'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { WarningType } from '@/components/swap/components/warning'
import { TradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { useDisclosure } from '@/lib/hooks/use-disclosure'
import { useGasData } from '@/lib/hooks/use-gas-data'
import { useSupportedNetworks } from '@/lib/hooks/use-network'
import { useQueryParams } from '@/lib/hooks/use-query-params'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSlippage } from '@/lib/providers/slippage'
import { formatWei } from '@/lib/utils'
import { getMaxBalance } from '@/lib/utils/max-balance'

import { useFormattedLeverageData } from '../../use-formatted-data'

import { BuySellSelector } from './components/buy-sell-selector'
import { LeverageSelector } from './components/leverage-selector'
import { Summary } from './components/summary'

import './styles.css'

const hiddenLeverageWarnings = [WarningType.flashbots]

export function LeverageWidget() {
  const gasData = useGasData()
  const isSupportedNetwork = useSupportedNetworks(supportedNetworks)
  const { queryParams } = useQueryParams()
  const { address } = useWallet()
  const {
    inputToken,
    inputTokenAmount,
    inputTokens,
    inputValue,
    isMinting,
    leverageType,
    outputTokens,
    transactionReview,
    onChangeInputTokenAmount,
    onSelectInputToken,
    onSelectLeverageType,
    onSelectOutputToken,
    outputToken,
    reset,
    supportedLeverageTypes,
    toggleIsMinting,
  } = useLeverageToken()

  const {
    contract,
    hasInsufficientFunds,
    inputAmoutUsd,
    inputBalance,
    inputBalanceFormatted,
    isFetchingQuote,
    ouputAmount,
    outputAmountUsd,
    resetData,
  } = useFormattedLeverageData()

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
    slippage,
  } = useSlippage()

  const onClickBalance = useCallback(() => {
    if (!inputBalance) return
    const maxBalance = getMaxBalance(inputToken, inputBalance, gasData)
    onChangeInputTokenAmount(formatWei(maxBalance, inputToken.decimals))
  }, [gasData, inputBalance, inputToken, onChangeInputTokenAmount])

  return (
    <div
      className='leverage-widget flex flex-col gap-4 rounded-lg px-4 pb-5 pt-4'
      id='close-position-scroll'
    >
      <div className='flex justify-end'>
        <Settings
          isAuto={isAutoSlippage}
          isDarkMode={true}
          slippage={slippage}
          onChangeSlippage={setSlippage}
          onClickAuto={autoSlippage}
        />
      </div>
      <BuySellSelector isMinting={isMinting} onClick={toggleIsMinting} />
      <LeverageSelector
        selectedTye={leverageType}
        supportedTypes={supportedLeverageTypes}
        onSelectType={onSelectLeverageType}
      />
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={inputBalanceFormatted}
        caption='Pay'
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
        outputAmountUsd={outputAmountUsd}
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
        isSupportedNetwork={isSupportedNetwork}
        queryNetwork={queryParams.queryNetwork}
        outputToken={outputToken}
        buttonLabelOverrides={{
          [TradeButtonState.default]: 'Review Transaction',
        }}
        onOpenTransactionReview={onOpenTransactionReview}
        onRefetchQuote={() => {}}
      />
      <SelectTokenModal
        isDarkMode={true}
        isOpen={isSelectInputTokenOpen}
        showBalances={true}
        onClose={onCloseSelectInputToken}
        onSelectedToken={(tokenSymbol) => {
          onSelectInputToken(tokenSymbol)
          onCloseSelectInputToken()
        }}
        address={address}
        tokens={inputTokens}
      />
      <SelectTokenModal
        isDarkMode={true}
        isOpen={isSelectOutputTokenOpen}
        onClose={onCloseSelectOutputToken}
        onSelectedToken={(tokenSymbol) => {
          onSelectOutputToken(tokenSymbol)
          onCloseSelectOutputToken()
        }}
        address={address}
        tokens={outputTokens}
      />
      {transactionReview && (
        <TransactionReviewModal
          isDarkMode={true}
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
