'use client'

import { useAppKit } from '@reown/appkit/react'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'

import { tradeMachineAtom } from '@/app/store/trade-machine'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { WarningComp } from '@/components/swap/components/warning'
import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import {
  TradeButtonState,
  useTradeButtonState,
} from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { useApproval } from '@/lib/hooks/use-approval'
import { useDisclosure } from '@/lib/hooks/use-disclosure'
import { useMainnetOnly } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { formatWei } from '@/lib/utils'

import { useDeposit } from '../../providers/deposit-provider'
import { PreSaleToken } from '../../types'

import { DepositStats } from './components/deposit-stats'
import { DepositWithdrawSelector } from './components/deposit-withdraw-selector'
import { Summary } from './components/summary'
import { TitleLogo } from './components/title-logo'
import { useFormattedData } from './use-formatted-data'

import './styles.css'

export function PreSaleWidget({ token }: { token: PreSaleToken }) {
  const isSupportedNetwork = useMainnetOnly()
  const { open } = useAppKit()
  const { address } = useWallet()
  const {
    inputValue,
    inputToken,
    inputTokenAmount,
    inputTokens,
    isDepositing,
    isFetchingQuote,
    onChangeInputTokenAmount,
    onSelectInputToken,
    outputToken,
    reset,
    toggleIsDepositing,
  } = useDeposit()
  const {
    earnedRewards,
    hasInsufficientFunds,
    inputAmoutUsd,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    userBalance,
    forceRefetch,
  } = useFormattedData()

  const {
    isApproved,
    isApproving,
    approve: onApprove,
  } = useApproval(
    inputToken,
    '0x04b59F9F09750C044D7CfbC177561E409085f0f3',
    inputTokenAmount,
  )

  const {
    isOpen: isSelectInputTokenOpen,
    onOpen: onOpenSelectInputToken,
    onClose: onCloseSelectInputToken,
  } = useDisclosure()

  // Should be always true as we only use ERC-20 as input tokens
  const shouldApprove = true
  const buttonState = useTradeButtonState(
    isSupportedNetwork,
    false,
    hasInsufficientFunds,
    shouldApprove,
    isApproved,
    isApproving,
    outputToken,
    inputValue,
  )
  const { buttonLabel: generatedButtonLabel, isDisabled } =
    useTradeButton(buttonState)
  const sendTradeEvent = useSetAtom(tradeMachineAtom)

  const buttonLabel = useMemo(() => {
    if (buttonState === TradeButtonState.default && isDepositing)
      return 'Deposit'
    if (buttonState === TradeButtonState.default && !isDepositing)
      return 'Withdraw'
    return generatedButtonLabel
  }, [buttonState, generatedButtonLabel, isDepositing])

  const onClickBalance = useCallback(() => {
    if (!inputTokenBalance) return
    onChangeInputTokenAmount(formatWei(inputTokenBalance, 18))
  }, [inputTokenBalance, onChangeInputTokenAmount])

  const onClickButton = useCallback(async () => {
    if (buttonState === TradeButtonState.connectWallet) {
      open({ view: 'Connect' })

      return
    }

    if (buttonState === TradeButtonState.wrongNetwork) {
      open({ view: 'Networks' })

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
      sendTradeEvent({ type: 'REVIEW' })
    }
  }, [buttonState, isApproved, onApprove, open, sendTradeEvent, shouldApprove])

  const onSelectToken = () => {
    if (!isDepositing) return
    onOpenSelectInputToken()
  }

  return (
    <div className='widget w-full min-w-80 flex-1 flex-col space-y-4 rounded-3xl p-6'>
      <TitleLogo logo={token.logo ?? ''} symbol={token.symbol} />
      <DepositWithdrawSelector
        isDepositing={isDepositing}
        onClick={toggleIsDepositing}
        token={token}
      />
      <DepositStats rewards={earnedRewards} userBalance={userBalance} />
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={inputTokenBalanceFormatted}
        caption='You pay'
        formattedFiat={inputAmoutUsd}
        selectedToken={inputToken}
        selectedTokenAmount={inputValue}
        showSelectorButtonChevron={isDepositing && inputTokens.length > 1}
        onChangeInput={(_, amount) => onChangeInputTokenAmount(amount)}
        onClickBalance={onClickBalance}
        onSelectToken={onSelectToken}
      />
      <Summary />
      <TradeButton
        label={buttonLabel}
        isDisabled={isDisabled}
        isLoading={isFetchingQuote}
        onClick={onClickButton}
      />
      <WarningComp
        warning={{
          title: 'PRT eligibility',
          node: "Deposits to the contract must be maintained until the end of the post-launch period (140 days after presale closes) in order to maintain PRT eligibility. Once a presale has ended, you can still deposit into a token but there won't be any PRT rewards for doing so.",
        }}
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
        tokens={inputTokens}
      />
      <TransactionReviewModal
        onClose={() => {
          reset()
          forceRefetch()
          sendTradeEvent({ type: 'CLOSE' })
        }}
      />
    </div>
  )
}
