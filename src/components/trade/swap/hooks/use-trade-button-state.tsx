import { useMemo } from 'react'

import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'

export enum TradeButtonState {
  approve,
  approving,
  connectWallet,
  default,
  enterAmount,
  fetchingError,
  insufficientFunds,
  loading,
  wrongNetwork,
}

export const useTradeButtonState = (
  hasFetchingError: boolean,
  hasInsufficientFunds: boolean,
  shouldApprove: boolean,
  isApproved: boolean,
  isApproving: boolean,
  isTransacting: boolean,
  sellTokenAmount: string
) => {
  const { address } = useWallet()
  const { isSupportedNetwork } = useNetwork()

  const buttonState = useMemo(() => {
    if (!address) return TradeButtonState.connectWallet
    if (!isSupportedNetwork) return TradeButtonState.wrongNetwork
    if (!isApproved && shouldApprove) return TradeButtonState.approve
    if (isApproving) return TradeButtonState.approving
    if (hasFetchingError) return TradeButtonState.fetchingError
    if (hasInsufficientFunds) return TradeButtonState.insufficientFunds
    if (isTransacting) return TradeButtonState.loading
    if (sellTokenAmount === '0') return TradeButtonState.enterAmount
    return TradeButtonState.default
  }, [
    address,
    hasFetchingError,
    hasInsufficientFunds,
    isApproved,
    isApproving,
    isSupportedNetwork,
    isTransacting,
    sellTokenAmount,
    shouldApprove,
  ])

  return buttonState
}
