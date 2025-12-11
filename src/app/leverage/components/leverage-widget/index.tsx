'use client'

import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'

import { TradeInputSelector } from '@/app/leverage/components/leverage-widget/trade-input-selector'
import { MarketSelector } from '@/app/leverage/components/stats/market-selector'
import { supportedNetworks } from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { raffleEpochAtom } from '@/app/store/raffle-epoch.atom'
import { tradeMachineAtom } from '@/app/store/trade-machine'
import { RaffleWidgetExtension } from '@/components/raffle/raffle-widget-extension'
import { Receive } from '@/components/receive'
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
import { formatWei } from '@/lib/utils'
import { getMaxBalance } from '@/lib/utils/max-balance'

import { useFormattedLeverageData } from '../../use-formatted-data'

import { BuySellSelector } from './components/buy-sell-selector'
import { LeverageSelector } from './components/leverage-selector'
import { Summary } from './components/summary'

const hiddenLeverageWarnings = [WarningType.flashbots]

// Tokens temporarily disabled for buying (minting)
const TEMPORARILY_DISABLED_BUY_TOKENS: string[] = []

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
    marketData,
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
  const raffleEpoch = useAtomValue(raffleEpochAtom)

  useEffect(() => {
    sendTradeEvent({ type: 'INITIALIZE' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    contract,
    hasInsufficientFunds,
    inputBalance,
    inputBalanceFormatted,
    inputValueUsd,
    inputValueFormattedUsd,
    isFetchingQuote,
    outputAmount,
    outputAmountUsd,
    quoteAmount,
    quoteAmountUsd,
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

  const isBuyTemporarilyDisabled = useMemo(
    () =>
      isMinting && TEMPORARILY_DISABLED_BUY_TOKENS.includes(outputToken.symbol),
    [isMinting, outputToken.symbol],
  )

  return (
    <div
      className='flex w-full flex-col gap-3 rounded-lg border border-white/15 bg-zinc-900 px-4 pb-5 pt-4 sm:gap-4'
      id='close-position-scroll'
    >
      <MarketSelector
        buttonClassName='bg-zinc-800 data-[active]:bg-zinc-700 data-[hover]:bg-zinc-700'
        className='hidden lg:flex'
        marketData={marketData}
        showLogo
      />
      <BuySellSelector
        isMinting={isMinting}
        animate
        onClick={toggleIsMinting}
      />
      <LeverageSelector
        selectedType={leverageType}
        supportedTypes={supportedLeverageTypes}
        onSelectType={onSelectLeverageType}
      />
      <div className='relative'>
        <TradeInputSelector
          balance={inputBalanceFormatted}
          caption='Pay'
          formattedFiat={inputValueFormattedUsd}
          selectedToken={inputToken}
          selectedTokenAmount={inputValue}
          onChangeInput={(_, amount) => onChangeInputTokenAmount(amount)}
          onClickBalance={onClickBalance}
          onSelectToken={onOpenSelectInputToken}
        />
      </div>

      <Receive
        isLoading={isFetchingQuote}
        showOutputAmount={inputTokenAmount > BigInt(0)}
        outputAmount={isMinting ? outputAmount : quoteAmount}
        outputAmountUsd={isMinting ? outputAmountUsd : quoteAmountUsd}
        selectedOutputToken={outputToken}
        onSelectToken={onOpenSelectOutputToken}
      />

      {isMinting && (
        <RaffleWidgetExtension
          isLoading={isFetchingQuote}
          usdAmount={inputValueUsd}
          epochTicketPerUsd={raffleEpoch?.ticketsPerUsdAmount ?? 0}
          epochMaxTicketsPerUser={raffleEpoch?.maxTicketsPerUser ?? 50}
        />
      )}

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
      {isBuyTemporarilyDisabled ? (
        <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center'>
          <div className='flex items-center gap-2 text-amber-400'>
            <ExclamationCircleIcon className='size-5' />
            <span className='font-semibold'>Temporarily Unavailable</span>
          </div>
          <p className='text-sm text-zinc-400'>
            Buying {outputToken.symbol} is temporarily disabled. Please check
            back later.
          </p>
        </div>
      ) : (
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
      )}
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
