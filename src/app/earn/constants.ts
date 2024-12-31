import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { arbitrum, base, mainnet } from 'viem/chains'

import { ETH, Token } from '@/constants/tokens'

function createToken(chainId: number, symbol: string): Token {
  const token = getTokenByChainAndSymbol(chainId, symbol)!
  return { ...token, image: token.logoURI }
}

export function getCurrencyTokens(chainId: number): Token[] {
  switch (chainId) {
    case mainnet.id:
      return [
        { ...ETH, chainId: mainnet.id },
        createToken(mainnet.id, 'WETH'),
        createToken(mainnet.id, 'WBTC'),
        createToken(mainnet.id, 'USDC'),
        createToken(mainnet.id, 'USDT'),
      ]
    case arbitrum.id:
      return [
        { ...ETH, chainId: arbitrum.id },
        createToken(arbitrum.id, 'WETH'),
        createToken(arbitrum.id, 'WBTC'),
        createToken(arbitrum.id, 'USDC'),
        createToken(arbitrum.id, 'USDT'),
      ]
    case base.id:
      return [
        { ...ETH, chainId: base.id },
        createToken(base.id, 'WETH'),
        createToken(base.id, 'USDC'),
      ]
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

export function getYieldTokens(): Token[] {
  const tokens: Token[] = yieldTokens.map((token) => {
    return {
      ...token,
      image: token.logoURI,
    }
  })
  return tokens
}

export const supportedNetworks = [mainnet.id, base.id]
