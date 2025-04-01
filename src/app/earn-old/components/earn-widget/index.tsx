'use client'

import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

import { Summary } from '@/app/earn-old/components/earn-widget/components/summary'
import { supportedNetworks } from '@/app/earn-old/constants'
import { useEarnContext } from '@/app/earn-old/provider'
import { useQueryParams } from '@/app/earn-old/use-query-params'
import { tradeMachineAtom } from '@/app/store/trade-machine'
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
import { useDisclosure } from '@/lib/hooks/use-disclosure'
import { useGasData } from '@/lib/hooks/use-gas-data'
import { useSupportedNetworks } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSlippage } from '@/lib/providers/slippage'
import { formatWei } from '@/lib/utils'
import { getMaxBalance } from '@/lib/utils/max-balance'

import { useFormattedEarnData } from '../../use-formatted-data'

import './styles.css'

const hiddenLeverageWarnings = [WarningType.flashbots]

export function EarnWidget() {
  const gasData = useGasData()
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

  const [tradeState, sendTradeEvent] = useAtom(tradeMachineAtom)

  const {
    auto: autoSlippage,
    isAuto: isAutoSlippage,
    set: setSlippage,
    setSlippageForToken,
    slippage,
  } = useSlippage()

  const onClickBalance = useCallback(() => {
    if (!inputBalance) return
    const maxBalance = getMaxBalance(inputToken, inputBalance, gasData)
    onChangeInputTokenAmount(formatWei(maxBalance, inputToken.decimals))
  }, [gasData, inputBalance, inputToken, onChangeInputTokenAmount])

  useEffect(() => {
    setSlippageForToken(isMinting ? outputToken.symbol : inputToken.symbol)
  }, [inputToken, isMinting, outputToken, setSlippageForToken])

  useEffect(() => {
    if (tradeState.matches('reset')) {
      reset()
      resetData()
      sendTradeEvent({ type: 'RESET_DONE' })
    }
  }, [tradeState, reset, resetData, sendTradeEvent])

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
        isSupportedNetwork={isSupportedNetwork}
        queryNetwork={queryParams.queryNetwork}
        outputToken={outputToken}
        buttonLabelOverrides={{
          [TradeButtonState.default]: 'Review Transaction',
        }}
        onOpenTransactionReview={() => sendTradeEvent({ type: 'REVIEW' })}
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
      <TransactionReviewModal
        onClose={() => {
          reset()
          resetData()
          sendTradeEvent({ type: 'CLOSE' })
        }}
      />
    </div>
  )
}
