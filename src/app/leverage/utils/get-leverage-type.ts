import {
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseBitcoinIndex,
  IndexCoopInverseEthereumIndex,
  Token,
} from '@/constants/tokens'

import { LeverageType } from '../provider'

export function getLeverageType({ symbol }: Token) {
  if (
    symbol === IndexCoopBitcoin2xIndex.symbol ||
    symbol === IndexCoopEthereum2xIndex.symbol
  ) {
    return LeverageType.Long2x
  }
  if (
    symbol === IndexCoopBitcoin3xIndex.symbol ||
    symbol === IndexCoopEthereum3xIndex.symbol
  ) {
    return LeverageType.Long3x
  }
  if (
    symbol === IndexCoopInverseBitcoinIndex.symbol ||
    symbol === IndexCoopInverseEthereumIndex.symbol
  ) {
    return LeverageType.Short
  }
  return null
}
