'use client'

import { useCallback } from 'react'

import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import {
  TradeButtonState,
  useTradeButtonState,
} from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { MAINNET, POLYGON } from '@/constants/chains'
import { useApproval } from '@/lib/hooks/use-approval'
import { useCustomAppKit } from '@/lib/hooks/use-custom-app-kit'
import { useDisclosure } from '@/lib/hooks/use-disclosure'
import { useSupportedNetworks } from '@/lib/hooks/use-network'
import { useTrade } from '@/lib/hooks/use-trade'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatWei } from '@/lib/utils'

import { useRedeem } from '../../providers/redeem-provider'

import { Receive } from './components/receive'
import { Summary } from './components/summary'
import { Title } from './components/title'
import { useFormattedData } from './use-formatted-data'

import './styles.css'

export function RedeemWidget() {
  const isSupportedNetwork = useSupportedNetworks([
    MAINNET.chainId,
    POLYGON.chainId,
  ])
  const { openConnectView, openNetworksView } = useCustomAppKit()
  const { address } = useWallet()
  const {
    inputTokenList,
    inputValue,
    inputToken,
    inputTokenAmount,
    isFetchingQuote,
    onChangeInputTokenAmount,
    onSelectInputToken,
    outputTokens,
    issuance,
    quoteResult,
    reset,
  } = useRedeem()
  const {
    hasInsufficientFunds,
    inputAmoutUsd,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    outputAmounts,
    outputAmountsUsd,
    outputAmountUsd,
    forceRefetch,
  } = useFormattedData()

  const { executeTrade, isTransacting } = useTrade()

  const {
    isApproved,
    isApproving,
    approve: onApprove,
  } = useApproval(inputToken, issuance, inputTokenAmount)

  const {
    isOpen: isSelectInputTokenOpen,
    onOpen: onOpenSelectInputToken,
    onClose: onCloseSelectInputToken,
  } = useDisclosure()

  const shouldApprove = true
  const buttonState = useTradeButtonState(
    isSupportedNetwork,
    false,
    hasInsufficientFunds,
    shouldApprove,
    isApproved,
    isApproving,
    outputTokens[0],
    inputValue,
  )

  const { buttonLabel, isDisabled } = useTradeButton(buttonState, {
    [TradeButtonState.default]: 'Redeem',
  })

  const onClickBalance = useCallback(() => {
    if (!inputTokenBalance) return
    onChangeInputTokenAmount(formatWei(inputTokenBalance, 18))
  }, [inputTokenBalance, onChangeInputTokenAmount])

  const onClickButton = useCallback(async () => {
    if (buttonState === TradeButtonState.connectWallet) {
      openConnectView('Redeem Widget')
      return
    }

    if (buttonState === TradeButtonState.wrongNetwork) {
      openNetworksView('Redeem Widget')

      return
    }

    // if (buttonState === TradeButtonState.fetchingError) {
    //   fetchOptions()
    //   return
    // }

    if (buttonState === TradeButtonState.insufficientFunds) return

    if (!isApproved && shouldApprove) {
      await onApprove()
      return
    }

    if (buttonState === TradeButtonState.default) {
      if (!quoteResult || quoteResult.quote === null) return
      try {
        await executeTrade(quoteResult.quote)
        reset()
        forceRefetch()
      } catch (error) {
        console.error('Error executing legacy redeem trade')
      }
    }
  }, [
    buttonState,
    executeTrade,
    forceRefetch,
    isApproved,
    shouldApprove,
    openConnectView,
    openNetworksView,
    onApprove,
    quoteResult,
    reset,
  ])

  return (
    <div className='widget w-full min-w-80 max-w-xl flex-1 flex-col space-y-4 self-center rounded-3xl p-6'>
      <Title />
      <TradeInputSelector
        balance={inputTokenBalanceFormatted}
        caption='You redeem'
        formattedFiat={inputAmoutUsd}
        selectedToken={inputToken}
        selectedTokenAmount={inputValue}
        onChangeInput={(_, amount) => onChangeInputTokenAmount(amount)}
        onClickBalance={onClickBalance}
        onSelectToken={onOpenSelectInputToken}
      />
      <Receive
        isLoading={isFetchingQuote}
        outputAmounts={outputAmounts}
        showOutputAmount={inputTokenAmount > BigInt(0)}
        outputAmountsUsd={outputAmountsUsd}
        ouputTokens={outputTokens}
        totalOutputAmountUsd={outputAmountUsd}
        onSelectToken={() => {}}
      />
      <Summary />
      <TradeButton
        label={buttonLabel}
        isDisabled={isDisabled}
        isLoading={isFetchingQuote || isTransacting}
        onClick={onClickButton}
      />
      <SelectTokenModal
        isDarkMode={false}
        isOpen={isSelectInputTokenOpen}
        showBalances={true}
        onClose={onCloseSelectInputToken}
        onSelectedToken={(tokenSymbol) => {
          onSelectInputToken(tokenSymbol)
          onCloseSelectInputToken()
        }}
        address={address}
        tokens={inputTokenList}
      />
    </div>
  )
}
