import { useMemo } from 'react'

import { useTradeButton } from '@/components/swap/hooks/use-trade-button'
import { useTradeButtonState } from '@/components/swap/hooks/use-trade-button-state'
import { TradeButton } from '@/components/trade-button'
import { Token } from '@/constants/tokens'
import { useApproval } from '@/lib/hooks/use-approval'
import { useNetwork } from '@/lib/hooks/use-network'
import { getNativeToken } from '@/lib/utils/tokens'

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
}

export function SmartTradeButton(props: SmartTradeButtonProps) {
  const {
    contract,
    hasFetchingError,
    hasInsufficientFunds,
    inputTokenAmount,
    inputToken,
    inputValue,
    isFetchingQuote,
    isSupportedNetwork,
    outputToken,
  } = props

  const { chainId } = useNetwork()

  const {
    isApproved: isApprovedForSwap,
    isApproving: isApprovingForSwap,
    approve: onApproveForSwap,
  } = useApproval(inputToken, contract, inputTokenAmount)

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
  const { buttonLabel, isDisabled } = useTradeButton(buttonState)

  const onClick = () => {
    // TODO:
  }

  return (
    <TradeButton
      label={buttonLabel}
      isDisabled={isDisabled}
      isLoading={isApprovingForSwap || isFetchingQuote}
      onClick={onClick}
    />
  )
}
