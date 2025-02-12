import { useAppKit } from '@reown/appkit/react'
import { useCallback, useMemo } from 'react'

import { WarningType, Warnings } from '@/components/swap/components/warning'
import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import {
  TradeButtonState,
  useTradeButtonState,
} from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { Token } from '@/constants/tokens'
import { useApproval } from '@/lib/hooks/use-approval'
import { useNetwork } from '@/lib/hooks/use-network'
import { useProtectionContext } from '@/lib/providers/protection'
import { useSignTerms } from '@/lib/providers/sign-terms-provider'
import { useSlippage } from '@/lib/providers/slippage'
import { getNativeToken, isTokenPairTradable } from '@/lib/utils/tokens'
import { isSupportedNetwork } from '@/lib/utils/wagmi'

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
    outputToken,
    onOpenTransactionReview,
    onRefetchQuote,
  } = props

  const { chainId } = useNetwork()
  const { open } = useAppKit()
  const { isRestrictedCountry, isUsingVpn } = useProtectionContext()
  const { signTermsOfService } = useSignTerms()
  const { slippage } = useSlippage()

  const {
    isApproved: isApprovedForSwap,
    isApproving: isApprovingForSwap,
    approve: onApproveForSwap,
  } = useApproval(inputToken, contract, inputTokenAmount)

  const isTradablePair = useMemo(
    () =>
      isTokenPairTradable(
        isRestrictedCountry || isUsingVpn,
        outputToken.symbol,
        chainId ?? 1,
      ),
    [isRestrictedCountry, isUsingVpn, outputToken.symbol, chainId],
  )

  const shouldApprove = useMemo(() => {
    const nativeToken = getNativeToken(chainId)
    const isNativeToken = nativeToken?.symbol === inputToken.symbol
    return !isNativeToken
  }, [chainId, inputToken])

  const buttonState = useTradeButtonState(
    isSupportedNetwork(chainId),
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

  const warnings: WarningType[] = useMemo(() => {
    if (
      !isTradablePair &&
      isRestrictedCountry &&
      !hiddenWarnings?.includes(WarningType.restricted)
    ) {
      return [WarningType.restricted]
    }
    if (
      !isTradablePair &&
      isUsingVpn &&
      !hiddenWarnings?.includes(WarningType.vpn)
    ) {
      return [WarningType.vpn]
    }
    if (
      buttonState === TradeButtonState.signTerms &&
      !hiddenWarnings?.includes(WarningType.signTerms)
    ) {
      return [WarningType.signTerms]
    }
    if (slippage > 9 && !hiddenWarnings?.includes(WarningType.priceImpact)) {
      return [WarningType.priceImpact]
    }
    if (!hiddenWarnings?.includes(WarningType.flashbots)) {
      return [WarningType.flashbots]
    }
    return []
  }, [
    buttonState,
    hiddenWarnings,
    isRestrictedCountry,
    isTradablePair,
    isUsingVpn,
    slippage,
  ])

  const onClick = useCallback(async () => {
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
    open,
    signTermsOfService,
    shouldApprove,
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
