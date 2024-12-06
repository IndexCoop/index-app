import { useEffect, useState } from 'react'

import { Token } from '@/constants/tokens'
import { useIsMismatchingNetwork } from '@/lib/hooks/use-is-mismatching-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { useSignTerms } from '@/lib/providers/sign-terms-provider'

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
  signTerms,
  wrongNetwork,
}

export const useTradeButtonState = (
  isSupportedNetwork: boolean,
  hasFetchingError: boolean,
  hasInsufficientFunds: boolean,
  shouldApprove: boolean,
  isApproved: boolean,
  isApproving: boolean,
  outputToken: Token,
  sellTokenAmount: string,
) => {
  const { address } = useWallet()
  const { hasFetchedSignature, hasSignedTerms } = useSignTerms()
  const [buttonState, setButtonState] = useState(TradeButtonState.default)
  const isMismatchingNetwork = useIsMismatchingNetwork()

  useEffect(() => {
    function getButtonState() {
      // Order of the checks matters
      if (!address) return TradeButtonState.connectWallet
      if (hasFetchedSignature && !hasSignedTerms)
        return TradeButtonState.signTerms
      if (!isSupportedNetwork || isMismatchingNetwork)
        return TradeButtonState.wrongNetwork
      if (sellTokenAmount === '0' || sellTokenAmount === '')
        return TradeButtonState.enterAmount
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
    hasFetchedSignature,
    hasInsufficientFunds,
    hasSignedTerms,
    isApproved,
    isApproving,
    isSupportedNetwork,
    isMismatchingNetwork,
    outputToken,
    sellTokenAmount,
    shouldApprove,
  ])

  return buttonState
}
