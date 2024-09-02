import { getLeverageBaseToken } from '@/app/leverage/utils/get-leverage-base-token'
import { getLeverageType } from '@/app/leverage/utils/get-leverage-type'
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
  USDC,
  USDT,
  WBTC,
  WETH,
} from '@/constants/tokens'
import { getAddressForToken } from '@/lib/utils/tokens'

import { LeverageToken, LeverageType } from './types'

export const baseTokens = [ETH, BTC]
export const currencyTokens = [ETH, WETH, WBTC, USDC, USDT]

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
