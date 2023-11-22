import { useMemo } from 'react'

import { TradeButtonState } from './use-trade-button-state'

export const useTradeButton = (buttonState: TradeButtonState) => {
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
      case TradeButtonState.enterAmount:
        return 'Enter an amount'
      case TradeButtonState.fetchingError:
        return 'Try again'
      case TradeButtonState.insufficientFunds:
        return 'Insufficient funds'
      case TradeButtonState.loading:
        return 'Swapping...'
      case TradeButtonState.wrongNetwork:
        return 'Wrong Network'
      default:
        return 'Swap'
    }
  }, [buttonState])

  const isDisabled = useMemo(() => {
    switch (buttonState) {
      case TradeButtonState.approve:
      case TradeButtonState.connectWallet:
      case TradeButtonState.fetchingError:
        return false
      case TradeButtonState.approving:
      case TradeButtonState.enterAmount:
      case TradeButtonState.insufficientFunds:
      case TradeButtonState.loading:
      case TradeButtonState.wrongNetwork:
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
