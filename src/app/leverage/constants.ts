import {
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseBitcoinIndex,
  IndexCoopInverseEthereumIndex,
} from '@/constants/tokens'
import { isAddress } from '@/lib/utils'

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

export const leverageTokenAddresses = leverageTokens
  .map((token) => token.arbitrumAddress ?? '')
  .filter((arbitrumAddress) => isAddress(arbitrumAddress))

export const leverageCollateralDebt = {
  [IndexCoopBitcoin2xIndex.arbitrumAddress!]: {
    collateralToken: '0x078f358208685046a11C85e8ad32895DED33A249',
    debtToken: '0xf611aEb5013fD2c0511c9CD55c7dc5C1140741A6',
  },
  [IndexCoopBitcoin3xIndex.arbitrumAddress!]: {
    collateralToken: '0x078f358208685046a11C85e8ad32895DED33A249',
    debtToken: '0xf611aEb5013fD2c0511c9CD55c7dc5C1140741A6',
  },
  [IndexCoopInverseBitcoinIndex.arbitrumAddress!]: {
    collateralToken: '0x724dc807b04555b71ed48a6896b6F41593b8C637',
    debtToken: '0xf611aeb5013fd2c0511c9cd55c7dc5c1140741a6',
  },
  [IndexCoopEthereum2xIndex.arbitrumAddress!]: {
    collateralToken: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8',
    debtToken: '0xf611aEb5013fD2c0511c9CD55c7dc5C1140741A6',
  },
  [IndexCoopEthereum3xIndex.arbitrumAddress!]: {
    collateralToken: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8',
    debtToken: '0xf611aEb5013fD2c0511c9CD55c7dc5C1140741A6',
  },
  [IndexCoopInverseEthereumIndex.arbitrumAddress!]: {
    collateralToken: '0x724dc807b04555b71ed48a6896b6F41593b8C637',
    debtToken: '0x92b42c66840C7AD907b4BF74879FF3eF7c529473',
  },
}
