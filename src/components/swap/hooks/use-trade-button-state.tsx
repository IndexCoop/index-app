import { useEffect, useState } from 'react'

import {
  Bitcoin2xFlexibleLeverageIndex,
  Ethereum2xFlexibleLeverageIndex,
  Token,
} from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'

export enum TradeButtonState {
  approve,
  approving,
  connectWallet,
  default,
  enterAmount,
  fetchingError,
  insufficientFunds,
  loading,
  notAvailable,
  wrongNetwork,
}

export const useTradeButtonState = (
  hasFetchingError: boolean,
  hasInsufficientFunds: boolean,
  shouldApprove: boolean,
  isApproved: boolean,
  isApproving: boolean,
  outputToken: Token,
  sellTokenAmount: string,
) => {
  const { address } = useWallet()
  const { isSupportedNetwork } = useNetwork()

  const [buttonState, setButtonState] = useState(TradeButtonState.default)

  useEffect(() => {
    function getButtonState() {
      // Order of the checks matters
      if (!address) return TradeButtonState.connectWallet
      if (!isSupportedNetwork) return TradeButtonState.wrongNetwork
      if (
        outputToken === Ethereum2xFlexibleLeverageIndex ||
        outputToken === Bitcoin2xFlexibleLeverageIndex
      )
        return TradeButtonState.notAvailable
      if (sellTokenAmount === '0') return TradeButtonState.enterAmount
      if (hasFetchingError) return TradeButtonState.fetchingError
      if (hasInsufficientFunds) return TradeButtonState.insufficientFunds
      if (isApproving) return TradeButtonState.approving
      if (!isApproved && shouldApprove) return TradeButtonState.approve
      return TradeButtonState.default
    }
    setButtonState(getButtonState())
  }, [
    address,
    hasFetchingError,
    hasInsufficientFunds,
    isApproved,
    isApproving,
    isSupportedNetwork,
    outputToken,
    sellTokenAmount,
    shouldApprove,
  ])

  return buttonState
}
