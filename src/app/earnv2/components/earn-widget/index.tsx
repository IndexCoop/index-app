'use client'

import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { isAddressEqual } from 'viem'

import { useQueryParams } from '@/app/earn/use-query-params'
import { supportedNetworks } from '@/app/earnv2/constants'
import { useEarnContext } from '@/app/earnv2/provider'
import { tradeMachineAtom } from '@/app/store/trade-machine'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { WarningType } from '@/components/swap/components/warning'
import { TradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { useDisclosure } from '@/lib/hooks/use-disclosure'
import { useGasData } from '@/lib/hooks/use-gas-data'
import { useSupportedNetworks } from '@/lib/hooks/use-network'
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
  const { queryParams } = useQueryParams()

  const {
    indexToken,
    inputToken,
    inputTokenAmount,
    inputValue,
    isMinting,
    onChangeInputTokenAmount,
    balances,
    products,
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
    resetData,
  } = useFormattedEarnData()

  const selectedProduct = products.find((p) =>
    isAddressEqual(p.tokenAddress, indexToken?.address ?? ''),
  )

  const { onOpen: onOpenSelectInputToken } = useDisclosure()

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
        onSelectToken={onOpenSelectInputToken}
      />
      <Projection
        amount={inputValue}
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
        buttonLabelOverrides={{
          [TradeButtonState.default]: 'Review Transaction',
        }}
        onOpenTransactionReview={() => sendTradeEvent({ type: 'REVIEW' })}
        onRefetchQuote={() => {}}
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
