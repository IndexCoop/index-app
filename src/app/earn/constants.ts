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

export function getTagline(indexTokenSymbol: string): string {
  switch (indexTokenSymbol.toLowerCase()) {
    case 'dseth':
      return 'The leading Ethereum liquid staking tokens on Ethereum.'
    case 'hyeth':
      return 'The highest ETH-denominated yields on Ethereum Mainnet.'
    case 'iceth':
      return 'ETH staking returns using a leveraged liquid staking strategy.'
    case 'icusd':
      return 'The largest USDC lending opportunities on Base.'
    default:
      return ''
  }
}

// Uncomment bridged L2 tokens only when price feeds are available
const yieldTokens = [
  getTokenByChainAndSymbol(base.id, 'icUSD'),
  getTokenByChainAndSymbol(mainnet.id, 'hyETH'),
  // getTokenByChainAndSymbol(arbitrum.id, 'hyETH'),
  // getTokenByChainAndSymbol(base.id, 'hyETH'),
  getTokenByChainAndSymbol(mainnet.id, 'icETH'),
  getTokenByChainAndSymbol(mainnet.id, 'dsETH'),
  // getTokenByChainAndSymbol(arbitrum.id, 'dsETH'),
  // getTokenByChainAndSymbol(base.id, 'dsETH'),
]

// TODO: Use new tokenlists
export function getYieldTokens(): Token[] {
  const tokens: Token[] = yieldTokens.map((token) => {
    return {
      ...token,
      image: token.logoURI,
    }
  })
  return tokens
}

export const supportedNetworks = [
  MAINNET.chainId,
  BASE.chainId,
  ARBITRUM.chainId,
]
