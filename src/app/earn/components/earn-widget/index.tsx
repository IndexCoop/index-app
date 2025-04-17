'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import range from 'lodash/range'
import { useCallback, useEffect, useMemo } from 'react'
import { isAddressEqual } from 'viem'

import { useQueryParams } from '@/app/earn-old/use-query-params'
import { tradeMachineAtom } from '@/app/store/trade-machine'
import { Receive } from '@/components/receive'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { WarningType } from '@/components/swap/components/warning'
import { TradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { useDisclosure } from '@/lib/hooks/use-disclosure'
import { useGasData } from '@/lib/hooks/use-gas-data'
import { useSupportedNetworks } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatWei } from '@/lib/utils'
import { getMaxBalance } from '@/lib/utils/max-balance'

import { supportedNetworks } from '../../constants'
import { useEarnContext } from '../../provider'
import { useFormattedEarnData } from '../../use-formatted-data'

import { DepositWithdraw } from './components/deposit-withdraw'
import { Projection } from './components/projection'
import { SmartTradeButton } from './components/smart-trade-button'
import { TradeInputSelector } from './components/trade-input-selector'

const hiddenLeverageWarnings = [WarningType.flashbots]

export function EarnWidget() {
  const gasData = useGasData()
  const isSupportedNetwork = useSupportedNetworks(supportedNetworks)
  const { address } = useWallet()
  const { queryParams } = useQueryParams()

  const {
    indexToken,
    inputToken,
    inputTokens,
    outputTokens,
    inputTokenAmount,
    inputValue,
    isMinting,
    onChangeInputTokenAmount,
    onSelectInputToken,
    onSelectOutputToken,
    balances,
    products,
    outputToken,
    reset,
    refetchQuote,
    toggleIsMinting,
    quoteResult,
  } = useEarnContext()

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
  } = useFormattedEarnData()

  const selectedProduct = products.find((p) =>
    isAddressEqual(p.tokenAddress, indexToken?.address ?? ''),
  )

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

  useEffect(() => {
    sendTradeEvent({ type: 'INITIALIZE' })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    <div className='earn-widget flex h-fit flex-col gap-6'>
      <DepositWithdraw
        isMinting={isMinting}
        toggleIsMinting={toggleIsMinting}
      />
      <TradeInputSelector
        showSelectorButtonChevron={isMinting}
        config={{ isReadOnly: false }}
        balance={inputBalanceFormatted}
        caption={isMinting ? 'Deposit' : 'Withdraw'}
        formattedFiat={inputAmoutUsd}
        selectedToken={inputToken}
        selectedTokenAmount={inputValue}
        onChangeInput={(_, amount) => onChangeInputTokenAmount(amount)}
        onClickBalance={onClickBalance}
        onSelectToken={() => isMinting && onOpenSelectInputToken()}
      />
      <AnimatePresence mode='wait'>
        {!isMinting && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              height: { duration: 0.2 },
              opacity: { duration: 0.2 },
            }}
            className='overflow-hidden'
          >
            <Receive
              isLoading={isFetchingQuote}
              outputAmount={ouputAmount}
              outputAmountUsd={outputAmountUsd}
              selectedOutputToken={outputToken}
              onSelectToken={onOpenSelectOutputToken}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Projection
        isQuoteLoading={isFetchingQuote}
        amount={inputValue}
        inputAmountUsd={quoteResult?.quote?.inputTokenAmountUsd ?? 0}
        balance={
          balances.find((b) => b.token === indexToken.address)?.value ??
          BigInt(0)
        }
        product={selectedProduct}
        isMinting={isMinting}
      />
      {hasFetchingError && (
        <div className='flex justify-center gap-2 text-sm text-red-400'>
          <p className='font-semibold'>Error fetching quote:</p>
          {tradeState.context.quoteError}
        </div>
      )}
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
        disabled={outputToken.symbol === 'icETH'}
        buttonLabelOverrides={
          outputToken.symbol === 'icETH'
            ? range(0, 10).reduce(
                (acc, s) =>
                  Object.assign(acc, {
                    [s as TradeButtonState]: `Deposit Unavailable`,
                  }),
                {} as Record<TradeButtonState, string>,
              )
            : {
                [TradeButtonState.default]: 'Review Transaction',
              }
        }
        onOpenTransactionReview={() => sendTradeEvent({ type: 'REVIEW' })}
        onRefetchQuote={refetchQuote}
      />
      <SelectTokenModal
        isDarkMode={true}
        isOpen={isSelectInputTokenOpen}
        showBalances={true}
        onClose={onCloseSelectInputToken}
        onSelectedToken={(tokenSymbol, chainId) => {
          onSelectInputToken(tokenSymbol, chainId)
          onCloseSelectInputToken()
        }}
        address={address}
        tokens={inputTokens}
      />
      <SelectTokenModal
        isDarkMode={true}
        isOpen={isSelectOutputTokenOpen}
        onClose={onCloseSelectOutputToken}
        onSelectedToken={(tokenSymbol, chainId) => {
          onSelectOutputToken(tokenSymbol, chainId)
          onCloseSelectOutputToken()
        }}
        address={address}
        tokens={outputTokens}
      />
      <TransactionReviewModal
        isDarkMode
        onClose={() => {
          reset()
          resetData()
          sendTradeEvent({ type: 'CLOSE' })
        }}
      />
    </div>
  )
}
