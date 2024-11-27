import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { base, mainnet } from 'viem/chains'

import { ARBITRUM, BASE, MAINNET } from '@/constants/chains'
import { ETH, Token, USDC, USDT, WBTC, WETH } from '@/constants/tokens'

// TODO: Use new tokenlists
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

const yieldTokens = [
  getTokenByChainAndSymbol(base.id, 'icUSD'),
  getTokenByChainAndSymbol(mainnet.id, 'hyETH'),
  getTokenByChainAndSymbol(mainnet.id, 'icETH'),
  getTokenByChainAndSymbol(mainnet.id, 'dsETH'),
]

// TODO: Use new tokenlists
export function getYieldTokens(): Token[] {
  const tokens: Token[] = yieldTokens.map((token) => {
    return {
      ...token,
      image: token.logoURI,
      url: '',
      coingeckoId: '',
      fees: undefined,
      isDangerous: true,
      indexTypes: [],
    }
  })
  return tokens
}

export const supportedNetworks = [
  MAINNET.chainId,
  BASE.chainId,
  ARBITRUM.chainId,
]
