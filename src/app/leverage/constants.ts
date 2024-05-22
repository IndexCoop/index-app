import {
    IndexCoopBitcoin2xIndex,
    IndexCoopBitcoin3xIndex,
    IndexCoopEthereum2xIndex,
    IndexCoopEthereum3xIndex,
    IndexCoopInverseBitcoinIndex,
    IndexCoopInverseEthereumIndex,
} from '@/constants/tokens'

export const ethLeverageTokens = [
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseEthereumIndex,
]

export const btcLeverageTokens = [
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopInverseBitcoinIndex,
]

export const leverageTokens = [...ethLeverageTokens, ...btcLeverageTokens]
