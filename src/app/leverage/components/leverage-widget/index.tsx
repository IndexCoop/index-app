'use client'

import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'

import { TradeInputSelector } from '@/app/leverage/components/leverage-widget/trade-input-selector'
import { supportedNetworks } from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { tradeMachineAtom } from '@/app/store/trade-machine'
import { Receive } from '@/components/receive'
import { Settings } from '@/components/settings'
import { SmartTradeButton } from '@/components/smart-trade-button'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
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
    onChangeInputTokenAmount,
    onSelectInputToken,
    onSelectLeverageType,
    onSelectOutputToken,
    outputToken,
    reset,
    refetchQuote,
    supportedLeverageTypes,
    toggleIsMinting,
  } = useLeverageToken()
  const [tradeState, sendTradeEvent] = useAtom(tradeMachineAtom)

  useEffect(() => {
    sendTradeEvent({ type: 'INITIALIZE' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  useEffect(() => {
    if (tradeState.matches('reset')) {
      reset()
      resetData()
      sendTradeEvent({ type: 'RESET_DONE' })
    }
  }, [tradeState, reset, resetData, sendTradeEvent])

  const hasFetchingError = useMemo(
    () => tradeState.matches('quoteNotFound'),
    [tradeState],
  )

  return (
    <div
      className='flex w-full flex-col gap-4 rounded-lg border border-white/15 bg-zinc-900 px-4 pb-5 pt-4'
      id='close-position-scroll'
    >
      <BuySellSelector
        isMinting={isMinting}
        animateBuy
        onClick={toggleIsMinting}
      />
      <LeverageSelector
        selectedTye={leverageType}
        supportedTypes={supportedLeverageTypes}
        onSelectType={onSelectLeverageType}
      />
      <div className='relative'>
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
        <div className='absolute right-2 top-2'>
          <Settings
            isAuto={isAutoSlippage}
            isDarkMode={true}
            slippage={slippage}
            onChangeSlippage={setSlippage}
            onClickAuto={autoSlippage}
          />
        </div>
      </div>

      <Receive
        isLoading={isFetchingQuote}
        outputAmount={ouputAmount}
        outputAmountUsd={outputAmountUsd}
        selectedOutputToken={outputToken}
        onSelectToken={onOpenSelectOutputToken}
      />
      {hasFetchingError && (
        <div className='flex items-center justify-center gap-2 text-sm text-red-400'>
          <div className='flex items-center gap-1'>
            <ExclamationCircleIcon className='size-5' />
            <h3 className='font-semibold'>Quote Error</h3>
            {':'}
          </div>
          <p> {tradeState.context.quoteError}</p>
        </div>
      )}
      <Summary />
      <SmartTradeButton
        contract={contract ?? ''}
        hasFetchingError={hasFetchingError}
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
        onOpenTransactionReview={() => sendTradeEvent({ type: 'REVIEW' })}
        onRefetchQuote={refetchQuote}
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
      <TransactionReviewModal
        isDarkMode={true}
        onClose={() => {
          reset()
          resetData()
          sendTradeEvent({ type: 'CLOSE' })
        }}
      />
    </div>
  )
}
