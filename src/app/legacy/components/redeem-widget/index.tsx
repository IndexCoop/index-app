'use client'

import { useDisclosure } from '@chakra-ui/react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useCallback, useMemo } from 'react'

import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TransactionReviewModal } from '@/components/swap/components/transaction-review'
import { TransactionReview } from '@/components/swap/components/transaction-review/types'
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

import { useRedeem } from '../../providers/redeem-provider'

import { Receive } from './components/receive'
import { Summary } from './components/summary'
import { Title } from './components/title'
import { useFormattedData } from './use-formatted-data'

import './styles.css'

export function RedeemWidget() {
  const isSupportedNetwork = useMainnetOnly()
  const { open } = useWeb3Modal()
  const { signTermsOfService } = useSignTerms()
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
    outputAmountUsd,
    forceRefetch,
    outputAmount,
  } = useFormattedData()

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
  const {
    isOpen: isTransactionReviewOpen,
    onOpen: onOpenTransactionReview,
    onClose: onCloseTransactionReview,
  } = useDisclosure()

  const shouldApprove = true
  const buttonState = useTradeButtonState(
    isSupportedNetwork,
    false,
    false,
    hasInsufficientFunds,
    shouldApprove,
    isApproved,
    isApproving,
    outputTokens[0],
    inputValue,
  )
  const { buttonLabel, isDisabled } = useTradeButton(buttonState)

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
    signTermsOfService,
    onOpenTransactionReview,
    open,

    shouldApprove,
  ])

  return (
    <div className='widget w-full min-w-80 max-w-xl flex-1 flex-col space-y-4 self-center rounded-3xl p-6'>
      <Title />
      <TradeInputSelector
        config={{ isReadOnly: false }}
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
        onSelectToken={() => {}}
        outputAmount={outputAmount}
        outputAmountUsd={outputAmountUsd}
        ouputTokens={outputTokens}
        showSelectorButtonChevron={false}
      />
      <Summary />
      <TradeButton
        label={buttonLabel}
        isDisabled={isDisabled}
        isLoading={isFetchingQuote}
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
