import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSwitchChain } from 'wagmi'

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
  hiddenWarnings?: WarningType[]
  isFetchingQuote: boolean
  isSupportedNetwork: boolean
  queryNetwork?: number
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
    hiddenWarnings,
    inputTokenAmount,
    inputToken,
    inputValue,
    isFetchingQuote,
    isSupportedNetwork,
    queryNetwork,
    outputToken,
    onOpenTransactionReview,
    onRefetchQuote,
  } = props

  const { openChainModal } = useChainModal()
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()
  const { chainId } = useNetwork()
  const router = useRouter()
  const pathname = usePathname()
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

  const isMismatchingQueryNetwork = useMemo(
    () => queryNetwork !== undefined && chainId !== queryNetwork,
    [chainId, queryNetwork],
  )

  const buttonState = useTradeButtonState(
    isSupportedNetwork,
    isMismatchingQueryNetwork,
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
    if (!isTradablePair && !hiddenWarnings?.includes(WarningType.restricted)) {
      setWarnings([WarningType.restricted])
      return
    }
    if (
      buttonState === TradeButtonState.signTerms &&
      !hiddenWarnings?.includes(WarningType.signTerms)
    ) {
      setWarnings([WarningType.signTerms])
      return
    }
    if (slippage > 9 && !hiddenWarnings?.includes(WarningType.priceImpact)) {
      setWarnings([WarningType.priceImpact])
      return
    }
    if (!hiddenWarnings?.includes(WarningType.flashbots)) {
      setWarnings([WarningType.flashbots])
      return
    }
    setWarnings([])
  }, [buttonState, hiddenWarnings, isTradablePair, slippage])

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

    if (buttonState === TradeButtonState.mismatchingQueryNetwork) {
      if (queryNetwork) {
        switchChain({ chainId: queryNetwork })
        router.replace(pathname)
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
    queryNetwork,
    switchChain,
  ])

  return (
    <>
      {isTradablePair && (
        <TradeButton
          label={buttonLabel}
          isDisabled={isDisabled}
          isLoading={isApprovingForSwap || isFetchingQuote}
          onClick={onClick}
        />
      )}
      <Warnings warnings={warnings} />
    </>
  )
}
