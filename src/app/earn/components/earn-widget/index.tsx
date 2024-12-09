'use client'

import { useDisclosure } from '@chakra-ui/react'
import { useCallback } from 'react'

import { Summary } from '@/app/earn/components/earn-widget/components/summary'
import { supportedNetworks } from '@/app/earn/constants'
import { useEarnContext } from '@/app/earn/provider'
import { Receive } from '@/components/receive'
import { BuySellSelector } from '@/components/selectors/buy-sell-selector'
import { SmartTradeButton } from '@/components/smart-trade-button'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { WarningType } from '@/components/swap/components/warning'
import { TradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { TokenDisplay } from '@/components/token-display'
import { useSupportedNetworks } from '@/lib/hooks/use-network'
import { useQueryParams } from '@/lib/hooks/use-query-params'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatWei } from '@/lib/utils'

import { useFormattedLeverageData } from '../../use-formatted-data'

import './styles.css'

const hiddenLeverageWarnings = [WarningType.flashbots]

export function EarnWidget() {
  const isSupportedNetwork = useSupportedNetworks(supportedNetworks)
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
    stats,
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
  } = useFormattedLeverageData(stats)

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

  const onClickBalance = useCallback(() => {
    if (!inputBalance) return
    onChangeInputTokenAmount(formatWei(inputBalance, inputToken.decimals))
  }, [inputBalance, inputToken, onChangeInputTokenAmount])

  return (
    <div className='earn-widget flex h-fit flex-col gap-3 rounded-lg px-4 py-6'>
      <TokenDisplay mini token={indexToken} />
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
        isOpen={isSelectInputTokenOpen}
        showBalances={false}
        onClose={onCloseSelectInputToken}
        onSelectedToken={(tokenSymbol) => {
          onSelectInputToken(tokenSymbol)
          onCloseSelectInputToken()
        }}
        address={address}
        tokens={inputTokens}
      />
      <SelectTokenModal
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
