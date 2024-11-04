import {
  BTC,
  ETH,
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseBitcoinIndex,
  IndexCoopInverseEthereumIndex,
} from '@/constants/tokens'

export function getLeverageBaseToken(symbol: string) {
  if (
    symbol === IndexCoopBitcoin2xIndex.symbol ||
    symbol === IndexCoopBitcoin3xIndex.symbol ||
    symbol === IndexCoopInverseBitcoinIndex.symbol
  ) {
    return BTC
  }

  if (
    symbol === IndexCoopEthereum2xIndex.symbol ||
    symbol === IndexCoopEthereum3xIndex.symbol ||
    symbol === IndexCoopInverseEthereumIndex.symbol
  ) {
    return ETH
  }

  return null
}
