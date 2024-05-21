import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Warnings, WarningType } from '@/components/swap/components/warning'
import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import {
  TradeButtonState,
  useTradeButtonState,
} from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { Token } from '@/constants/tokens'
import { useApproval } from '@/lib/hooks/use-approval'
import { useNetwork } from '@/lib/hooks/use-network'
import { useProtection } from '@/lib/providers/protection'
import { useSignTerms } from '@/lib/providers/sign-terms-provider'
import { useSlippage } from '@/lib/providers/slippage'
import { getNativeToken, isTokenPairTradable } from '@/lib/utils/tokens'

type SmartTradeButtonProps = {
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  inputValue: string
  contract: string
  hasFetchingError: boolean
  hasInsufficientFunds: boolean
  isFetchingQuote: boolean
  isSupportedNetwork: boolean
  buttonLabelOverrides: { [key: number]: string }
  onOpenTransactionReview: () => void
  onRefetchQuote: () => void
}

export function SmartTradeButton(props: SmartTradeButtonProps) {
  const {
    buttonLabelOverrides,
    contract,
    hasFetchingError,
    hasInsufficientFunds,
    inputTokenAmount,
    inputToken,
    inputValue,
    isFetchingQuote,
    isSupportedNetwork,
    outputToken,
    onOpenTransactionReview,
    onRefetchQuote,
  } = props

  const { openChainModal } = useChainModal()
  const { openConnectModal } = useConnectModal()
  const { chainId } = useNetwork()
  const requiresProtection = useProtection()
  const { signTermsOfService } = useSignTerms()
  const { slippage } = useSlippage()

  const {
    isApproved: isApprovedForSwap,
    isApproving: isApprovingForSwap,
    approve: onApproveForSwap,
  } = useApproval(inputToken, contract, inputTokenAmount)

  const isTradablePair = useMemo(
    () => isTokenPairTradable(requiresProtection, inputToken, outputToken),
    [requiresProtection, inputToken, outputToken],
  )

  const shouldApprove = useMemo(() => {
    const nativeToken = getNativeToken(chainId)
    const isNativeToken = nativeToken?.symbol === inputToken.symbol
    return !isNativeToken
  }, [chainId, inputToken])

  const buttonState = useTradeButtonState(
    isSupportedNetwork,
    hasFetchingError,
    hasInsufficientFunds,
    shouldApprove,
    isApprovedForSwap,
    isApprovingForSwap,
    outputToken,
    inputValue,
  )
  const { buttonLabel, isDisabled } = useTradeButton(
    buttonState,
    buttonLabelOverrides,
  )

  const [warnings, setWarnings] = useState<WarningType[]>([])

  useEffect(() => {
    if (!isTradablePair) {
      setWarnings([WarningType.restricted])
      return
    }
    if (buttonState === TradeButtonState.signTerms) {
      setWarnings([WarningType.signTerms])
      return
    }
    if (slippage > 9) {
      setWarnings([WarningType.priceImpact])
      return
    }
    setWarnings([WarningType.flashbots])
  }, [buttonState, isTradablePair, slippage])

  const onClick = useCallback(async () => {
    if (buttonState === TradeButtonState.connectWallet) {
      if (openConnectModal) {
        openConnectModal()
      }
      return
    }

    if (buttonState === TradeButtonState.signTerms) {
      await signTermsOfService()
      return
    }

    if (buttonState === TradeButtonState.wrongNetwork) {
      if (openChainModal) {
        openChainModal()
      }
      return
    }

    if (buttonState === TradeButtonState.fetchingError) {
      onRefetchQuote()
      return
    }

    if (buttonState === TradeButtonState.insufficientFunds) return

    if (!isApprovedForSwap && shouldApprove) {
      await onApproveForSwap()
      return
    }

    if (buttonState === TradeButtonState.default) {
      onOpenTransactionReview()
    }
  }, [
    buttonState,
    isApprovedForSwap,
    onApproveForSwap,
    onOpenTransactionReview,
    onRefetchQuote,
    openChainModal,
    openConnectModal,
    signTermsOfService,
    shouldApprove,
  ])

  return (
    <>
      <TradeButton
        label={buttonLabel}
        isDisabled={isDisabled}
        isLoading={isApprovingForSwap || isFetchingQuote}
        onClick={onClick}
      />
      <Warnings warnings={warnings} />
    </>
  )
}
