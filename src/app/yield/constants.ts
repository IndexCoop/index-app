import { ARBITRUM, BASE, MAINNET } from '@/constants/chains'
import {
  ETH,
  HighYieldETHIndex,
  Token,
  USDC,
  USDT,
  WBTC,
  WETH,
} from '@/constants/tokens'
import { getAddressForToken } from '@/lib/utils/tokens'

export const yieldTokens = [HighYieldETHIndex]

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

// FIXME
export function getYieldTokens(chainId: number): Token[] {
  const tokens: (Token | null)[] = yieldTokens.map((token) => {
    const address = getAddressForToken(token, chainId)
    if (!address) {
      return null
    }
    return {
      ...token,
      address,
    }
  })
  return tokens.filter((token): token is Token => token !== null)
}

export const supportedNetworks = [
  MAINNET.chainId,
  BASE.chainId,
  ARBITRUM.chainId,
]
