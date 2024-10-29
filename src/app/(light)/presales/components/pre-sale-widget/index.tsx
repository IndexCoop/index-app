'use client'

import { useDisclosure } from '@chakra-ui/react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useCallback, useMemo } from 'react'

import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { TransactionReview } from '@/components/swap/components/transaction-review/types'
import { WarningComp } from '@/components/swap/components/warning'
import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import {
  TradeButtonState,
  useTradeButtonState,
} from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { useApproval } from '@/lib/hooks/use-approval'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useMainnetOnly } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSignTerms } from '@/lib/providers/sign-terms-provider'
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
  const { open } = useWeb3Modal()
  const { signTermsOfService } = useSignTerms()
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
    quoteResult,
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
  const {
    isOpen: isTransactionReviewOpen,
    onOpen: onOpenTransactionReview,
    onClose: onCloseTransactionReview,
  } = useDisclosure()

  // Should be always true as we only use ERC-20 as input tokens
  const shouldApprove = true
  const buttonState = useTradeButtonState(
    isSupportedNetwork,
    false,
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

  const buttonLabel = useMemo(() => {
    if (buttonState === TradeButtonState.default && isDepositing)
      return 'Deposit'
    if (buttonState === TradeButtonState.default && !isDepositing)
      return 'Withdraw'
    return generatedButtonLabel
  }, [buttonState, generatedButtonLabel, isDepositing])

  const transactionReview = useMemo((): TransactionReview | null => {
    if (isFetchingQuote || quoteResult === null) return null
    const quote = quoteResult.quote
    if (quote) {
      return {
        ...quote,
        contractAddress: quote.contract,
        quoteResults: {
          bestQuote: QuoteType.issuance,
          results: {
            flashmint: null,
            index: null,
            issuance: quoteResult,
            redemption: null,
          },
        },
        selectedQuote: QuoteType.issuance,
      }
    }
    return null
  }, [isFetchingQuote, quoteResult])

  const onClickBalance = useCallback(() => {
    if (!inputTokenBalance) return
    onChangeInputTokenAmount(formatWei(inputTokenBalance, 18))
  }, [inputTokenBalance, onChangeInputTokenAmount])

  const onClickButton = useCallback(async () => {
    if (buttonState === TradeButtonState.connectWallet) {
      open({ view: 'Connect' })

      return
    }

    if (buttonState === TradeButtonState.signTerms) {
      await signTermsOfService()
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
      onOpenTransactionReview()
    }
  }, [
    buttonState,
    isApproved,
    onApprove,
    open,
    signTermsOfService,
    onOpenTransactionReview,
    shouldApprove,
  ])

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
      {transactionReview && (
        <TransactionReviewModal
          isOpen={isTransactionReviewOpen}
          onClose={() => {
            reset()
            forceRefetch()
            onCloseTransactionReview()
          }}
          transactionReview={transactionReview}
        />
      )}
    </div>
  )
}
