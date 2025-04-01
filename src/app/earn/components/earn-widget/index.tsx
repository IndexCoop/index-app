'use client'

import { useAtom } from 'jotai'
import range from 'lodash/range'
import { useCallback, useEffect } from 'react'
import { isAddressEqual } from 'viem'

import { supportedNetworks } from '@/app/earn/constants'
import { useEarnContext } from '@/app/earn/provider'
import { useQueryParams } from '@/app/earn-old/use-query-params'
import { tradeMachineAtom } from '@/app/store/trade-machine'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { WarningType } from '@/components/swap/components/warning'
import { TradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { useDisclosure } from '@/lib/hooks/use-disclosure'
import { useGasData } from '@/lib/hooks/use-gas-data'
import { useSupportedNetworks } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSlippage } from '@/lib/providers/slippage'
import { formatWei } from '@/lib/utils'
import { getMaxBalance } from '@/lib/utils/max-balance'

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
    inputTokenAmount,
    inputValue,
    isMinting,
    onChangeInputTokenAmount,
    onSelectInputToken,
    balances,
    products,
    outputToken,
    reset,
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

  const [tradeState, sendTradeEvent] = useAtom(tradeMachineAtom)

  const {
    // auto: autoSlippage,
    // isAuto: isAutoSlippage,
    // set: setSlippage,
    setSlippageForToken,
    // slippage,
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
        onRefetchQuote={() => {}}
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
