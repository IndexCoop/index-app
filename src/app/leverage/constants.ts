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
    collateralAmountToken: '0x078f358208685046a11C85e8ad32895DED33A249', // ARB WBTC
    collateralPriceToken: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // ETH WBTC
    debtAmountToken: '0xf611aEb5013fD2c0511c9CD55c7dc5C1140741A6', // ARB VAR USDC
    debtPriceToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // ETH USDC
  },
  [IndexCoopBitcoin3xIndex.arbitrumAddress!]: {
    collateralAmountToken: '0x078f358208685046a11C85e8ad32895DED33A249', // ARB WBTC
    collateralPriceToken: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // ETH WBTC
    debtAmountToken: '0xf611aEb5013fD2c0511c9CD55c7dc5C1140741A6', // ARB VAR USDC
    debtPriceToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // ETH USDC
  },
  [IndexCoopInverseBitcoinIndex.arbitrumAddress!]: {
    collateralAmountToken: '0x724dc807b04555b71ed48a6896b6F41593b8C637', // ARB USDC
    collateralPriceToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // ETH USDC
    debtAmountToken: '0x92b42c66840C7AD907b4BF74879FF3eF7c529473', // ARB VAR WBTC
    debtPriceToken: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // ETH WBTC
  },
  [IndexCoopEthereum2xIndex.arbitrumAddress!]: {
    collateralAmountToken: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8', // ARB WETH
    collateralPriceToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // ETH WETH
    debtAmountToken: '0xf611aEb5013fD2c0511c9CD55c7dc5C1140741A6', // ARB VAR USDC
    debtPriceToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // ETH USDC
  },
  [IndexCoopEthereum3xIndex.arbitrumAddress!]: {
    collateralAmountToken: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8', // ARB WETH
    collateralPriceToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // ETH WETH
    debtAmountToken: '0xf611aEb5013fD2c0511c9CD55c7dc5C1140741A6', // ARB VAR USDC
    debtPriceToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // ETH USDC
  },
  [IndexCoopInverseEthereumIndex.arbitrumAddress!]: {
    collateralAmountToken: '0x724dc807b04555b71ed48a6896b6F41593b8C637', // ARB USDC
    collateralPriceToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // ETH USDC
    debtAmountToken: '0x0c84331e39d6658Cd6e6b9ba04736cC4c4734351', // ARB VAR WETH
    debtPriceToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // ETH WETH
  },
}
