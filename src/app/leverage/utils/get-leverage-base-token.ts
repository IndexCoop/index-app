import {
  BTC,
  ETH,
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseBitcoinIndex,
  IndexCoopInverseEthereumIndex,
  Token,
} from '@/constants/tokens'

export function getLeverageBaseToken({ symbol }: Token) {
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
