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
        return labelOverrides[TradeButtonState.approve] ?? 'Approve'
      case TradeButtonState.approving:
        return labelOverrides[TradeButtonState.approving] ?? 'Approving...'
      case TradeButtonState.connectWallet:
        return (
          labelOverrides[TradeButtonState.connectWallet] ?? 'Connect Wallet'
        )
      case TradeButtonState.enterAmount:
        return labelOverrides[TradeButtonState.enterAmount] ?? 'Enter an amount'
      case TradeButtonState.fetchingError:
        return labelOverrides[TradeButtonState.fetchingError] ?? 'Try again'
      case TradeButtonState.insufficientFunds:
        return (
          labelOverrides[TradeButtonState.insufficientFunds] ??
          'Insufficient funds'
        )
      case TradeButtonState.loading:
        return labelOverrides[TradeButtonState.loading] ?? 'Swapping...'
      case TradeButtonState.notAvailable:
        return labelOverrides[TradeButtonState.notAvailable] ?? 'Not available'
      case TradeButtonState.wrongNetwork:
        return labelOverrides[TradeButtonState.wrongNetwork] ?? 'Wrong Network'
      default:
        return labelOverrides[TradeButtonState.default] ?? 'Swap'
    }
  }, [buttonState, labelOverrides])

  const isDisabled = useMemo(() => {
    switch (buttonState) {
      case TradeButtonState.approve:
      case TradeButtonState.connectWallet:
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
