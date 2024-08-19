import { useMemo } from 'react'

import { TradeButtonState } from './use-trade-button-state'

export function useTradeButton(
  buttonState: TradeButtonState,
  labelOverrides: { [key: number]: string } = {},
) {
  /**
   * Returns the correct trade button label according to different states.
   * @returns string label for trade button
   */
  const buttonLabel = useMemo(() => {
    switch (buttonState) {
      case TradeButtonState.approve:
        return 'Approve'
      case TradeButtonState.approving:
        return 'Approving...'
      case TradeButtonState.connectWallet:
        return 'Connect Wallet'
      case TradeButtonState.signTerms:
        return 'Sign Terms and Conditions'
      case TradeButtonState.enterAmount:
        return 'Enter an amount'
      case TradeButtonState.fetchingError:
        return 'Try again'
      case TradeButtonState.insufficientFunds:
        return 'Insufficient funds'
      case TradeButtonState.loading:
        return 'Swapping...'
      case TradeButtonState.notAvailable:
        return 'Not available'
      case TradeButtonState.wrongNetwork:
        return 'Wrong Network'
      default:
        return labelOverrides[TradeButtonState.default] ?? 'Swap'
    }
  }, [buttonState, labelOverrides])

  const isDisabled = useMemo(() => {
    switch (buttonState) {
      case TradeButtonState.approve:
      case TradeButtonState.connectWallet:
      case TradeButtonState.signTerms:
      case TradeButtonState.fetchingError:
      case TradeButtonState.wrongNetwork:
        return false
      case TradeButtonState.approving:
      case TradeButtonState.enterAmount:
      case TradeButtonState.insufficientFunds:
      case TradeButtonState.loading:
      case TradeButtonState.notAvailable:
        return true
      default:
        return false
    }
  }, [buttonState])

  return {
    buttonLabel,
    isDisabled,
  }
}
