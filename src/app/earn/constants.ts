import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { arbitrum, base, mainnet } from 'viem/chains'

import { ETH, Token } from '@/constants/tokens'

function createToken(chainId: number, symbol: string): Token {
  const token = getTokenByChainAndSymbol(chainId, symbol)!

  return {
    ...token,
    symbol: token.symbol.replace('₮0', 'T'), // handle special case of USD₮0 on arbitrum
    image: token.logoURI,
  }
}

export function getCurrencyTokens(
  chainId: number,
  isIcETh: boolean = false,
): Token[] {
  switch (chainId) {
    case mainnet.id:
      return isIcETh
        ? [{ ...ETH, chainId: mainnet.id }, createToken(mainnet.id, 'WETH')]
        : [
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
        createToken(arbitrum.id, 'USD₮0'),
      ]
    case base.id:
      return [
        { ...ETH, chainId: base.id },
        createToken(base.id, 'WETH'),
        createToken(base.id, 'USDC'),
        createToken(base.id, 'wstETH'),
      ]
    default:
      return []
  }
}

export function getTagline(indexTokenSymbol: string): string {
  switch (indexTokenSymbol.toLowerCase()) {
    case 'hyeth':
      return 'The highest ETH-denominated yields on Ethereum Mainnet.'
    case 'iceth':
      return 'ETH staking returns using a leveraged liquid staking strategy.'
    case 'wsteth15x':
      return '15x ETH Smart Loop using a delta-neutral leveraged yield strategy.'
    default:
      return ''
  }
}

// Uncomment bridged L2 tokens only when price feeds are available
const yieldTokens = [
  getTokenByChainAndSymbol(mainnet.id, 'hyETH'),
  getTokenByChainAndSymbol(base.id, 'wstETH15x'),
  // getTokenByChainAndSymbol(arbitrum.id, 'hyETH'),
  // getTokenByChainAndSymbol(base.id, 'hyETH'),
  getTokenByChainAndSymbol(mainnet.id, 'icETH'),
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
