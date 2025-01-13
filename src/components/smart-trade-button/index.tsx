import { useWeb3Modal } from '@web3modal/wagmi/react'
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
import { useProtectionContext } from '@/lib/providers/protection'
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
    outputToken,
    onOpenTransactionReview,
    onRefetchQuote,
  } = props

  const { chainId } = useNetwork()
  const { open } = useWeb3Modal()
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
        inputToken.symbol,
        outputToken.symbol,
        chainId ?? 1,
      ),
    [
      isRestrictedCountry,
      isUsingVpn,
      inputToken.symbol,
      outputToken.symbol,
      chainId,
    ],
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
    if (
      !isTradablePair &&
      isRestrictedCountry &&
      !hiddenWarnings?.includes(WarningType.restricted)
    ) {
      setWarnings([WarningType.restricted])
      return
    }
    if (
      !isTradablePair &&
      isUsingVpn &&
      !hiddenWarnings?.includes(WarningType.vpn)
    ) {
      setWarnings([WarningType.vpn])
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
