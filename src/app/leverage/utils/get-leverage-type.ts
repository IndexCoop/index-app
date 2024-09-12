import {
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseBitcoinIndex,
  IndexCoopInverseEthereumIndex,
} from '@/constants/tokens'

import { LeverageType } from '../types'

export const getLeverageAction = ({
  isMint,
  isFromUser,
  isToUser,
  isFromContract,
  isToContract,
}: {
  isMint: boolean
  isFromUser: boolean
  isToUser: boolean
  isFromContract: boolean
  isToContract: boolean
}): 'open' | 'close' | 'transfer' => {
  if (isMint || (isFromContract && isToUser)) return 'open'
  if (isFromUser && isToContract) return 'close'

  return 'transfer'
}

export function getLeverageType(symbol: string): LeverageType | null {
  switch (symbol) {
    case IndexCoopBitcoin2xIndex.symbol:
    case IndexCoopEthereum2xIndex.symbol:
      return LeverageType.Long2x
    case IndexCoopBitcoin3xIndex.symbol:
    case IndexCoopEthereum3xIndex.symbol:
      return LeverageType.Long3x
    case IndexCoopInverseBitcoinIndex.symbol:
    case IndexCoopInverseEthereumIndex.symbol:
      return LeverageType.Short
    default:
      return null
  }
}
