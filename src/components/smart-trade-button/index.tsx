import { useMemo } from 'react'

import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import { useTradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { useApproval } from '@/lib/hooks/use-approval'
import { getNativeToken } from '@/lib/utils/tokens'

export function SmartTradeButton() {
  const {
    isApproved: isApprovedForSwap,
    isApproving: isApprovingForSwap,
    approve: onApproveForSwap,
  } = useApproval(inputToken, contract, inputTokenAmountWei.toBigInt())

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
    sellTokenAmount,
  )
  const { buttonLabel, isDisabled } = useTradeButton(buttonState)

  return (
    <TradeButton
      label={buttonLabel}
      isDisabled={isDisabled}
      isLoading={isApprovingForSwap || isFetchingAnyQuote}
      onClick={onClickTradeButton}
    />
  )
}
