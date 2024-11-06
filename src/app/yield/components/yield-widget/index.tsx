'use client'

import { useDisclosure } from '@chakra-ui/react'
import { useCallback } from 'react'

import { supportedNetworks } from '@/app/yield/constants'
import { useYieldContext } from '@/app/yield/provider'
import { Receive } from '@/components/receive'
import { SmartTradeButton } from '@/components/smart-trade-button'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { WarningType } from '@/components/swap/components/warning'
import { TradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { useSupportedNetworks } from '@/lib/hooks/use-network'
import { useQueryParams } from '@/lib/hooks/use-query-params'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatWei } from '@/lib/utils'
import { chains } from '@/lib/utils/wagmi'

import { useFormattedLeverageData } from '../../use-formatted-data'

import { BaseTokenSelector } from './components/base-token-selector'
import { BuySellSelector } from './components/buy-sell-selector'
import { Fees } from './components/fees'
import { Summary } from './components/summary'

import './styles.css'

const hiddenLeverageWarnings = [WarningType.flashbots]

type Props = {
  onClickBaseTokenSelector: () => void
}

export function YieldWidget(props: Props) {
  const isSupportedNetwork = useSupportedNetworks(supportedNetworks)
  const { queryParams } = useQueryParams()
  const { address } = useWallet()
  const {
    baseToken,
    inputToken,
    inputTokenAmount,
    inputTokens,
    inputValue,
    isMinting,
    leverageType,
    outputTokens,
    stats,
    transactionReview,
    onChangeInputTokenAmount,
    onSelectInputToken,
    onSelectOutputToken,
    outputToken,
    reset,
    toggleIsMinting,
  } = useYieldContext()

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
    <div
      className='widget flex flex-col gap-3 rounded-3xl p-6'
      id='close-position-scroll'
    >
      <BaseTokenSelector
        baseToken={baseToken}
        onClick={props.onClickBaseTokenSelector}
      />
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
      <Fees leverageType={leverageType} />
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
          [TradeButtonState.mismatchingQueryNetwork]: `Switch to ${chains.find(({ id }) => id === queryParams.queryNetwork)?.name}`,
        }}
        onOpenTransactionReview={onOpenTransactionReview}
        onRefetchQuote={() => {}}
      />
      <SelectTokenModal
        isDarkMode={true}
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
