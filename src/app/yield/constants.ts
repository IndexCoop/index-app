import { getLeverageBaseToken } from '@/app/yield/utils/get-leverage-base-token'
import { getLeverageType } from '@/app/yield/utils/get-leverage-type'
import { ARBITRUM, BASE, MAINNET } from '@/constants/chains'
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
  USDC,
  USDT,
  WBTC,
  WETH,
} from '@/constants/tokens'
import { getAddressForToken } from '@/lib/utils/tokens'

import { LeverageToken, LeverageType } from './types'

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

export function getBaseTokens(chainId: number): Token[] {
  switch (chainId) {
    case MAINNET.chainId:
    case ARBITRUM.chainId:
      return [ETH, BTC]
    case BASE.chainId:
      return [ETH]
    default:
      return []
  }
}

export function getCurrencyTokens(chainId: number): Token[] {
  switch (chainId) {
    case MAINNET.chainId:
    case ARBITRUM.chainId:
      return [ETH, WETH, WBTC, USDC, USDT]
    case BASE.chainId:
      return [ETH, WETH, USDC]
    default:
      return []
  }
}

export function getLeverageTokens(chainId: number): LeverageToken[] {
  const tokens: (LeverageToken | null)[] = leverageTokens.map((token) => {
    const baseToken = getLeverageBaseToken(token.symbol)
    const address = getAddressForToken(token, chainId)
    const leverageType = getLeverageType(token.symbol)
    if (!baseToken || !address || leverageType === null) {
      return null
    }
    return {
      ...token,
      address,
      baseToken: baseToken.symbol,
      leverageType,
    }
  })
  return tokens.filter((token): token is LeverageToken => token !== null)
}

export const supportedLeverageTypes = {
  [ARBITRUM.chainId]: [
    LeverageType.Short,
    LeverageType.Long2x,
    LeverageType.Long3x,
  ],
  [BASE.chainId]: [LeverageType.Long2x, LeverageType.Long3x],
  [MAINNET.chainId]: [LeverageType.Long2x],
}

export const supportedNetworks = [
  MAINNET.chainId,
  BASE.chainId,
  ARBITRUM.chainId,
]
