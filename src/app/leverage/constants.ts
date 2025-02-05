import {
  getTokenByChainAndSymbol,
  isLeverageToken,
} from '@indexcoop/tokenlists'
import { arbitrum, base, mainnet } from 'viem/chains'

import { LeverageRatio } from '@/app/leverage/components/stats/leverage-selector-container'
import { getLeverageBaseToken } from '@/app/leverage/utils/get-leverage-base-token'
import { getLeverageType } from '@/app/leverage/utils/get-leverage-type'
import { ARBITRUM, BASE, MAINNET } from '@/constants/chains'
import { BTC, ETH, Token, USDC, USDT, WBTC, WETH } from '@/constants/tokens'

import { LeverageToken, LeverageType, Market } from './types'

const cbBTC = getTokenByChainAndSymbol(base.id, 'cbBTC')

export const ethLeverageTokenSymbols = ['ETH2X', 'ETH3X', 'iETH1X', 'ETH2xBTC']

export const btcLeverageTokenSymbols = ['BTC2X', 'BTC3X', 'iBTC1X', 'BTC2xETH']

export const leverageTokens = [
  ...ethLeverageTokenSymbols,
  ...btcLeverageTokenSymbols,
]

export function getBaseTokens(chainId: number): Token[] {
  switch (chainId) {
    case MAINNET.chainId:
    case ARBITRUM.chainId:
      return [ETH, BTC]
    case BASE.chainId:
      return [ETH, BTC]
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
      return [ETH, WETH, USDC, { ...cbBTC, image: cbBTC.logoURI }]
    default:
      return []
  }
}

export function getLeverageTokens(chainId: number): LeverageToken[] {
  const tokens: (LeverageToken | null)[] = leverageTokens.map((tokenSymbol) => {
    const token = getTokenByChainAndSymbol(chainId, tokenSymbol)
    if (!token) return null
    if (!isLeverageToken(token)) return null
    const baseToken = getLeverageBaseToken(token.symbol)
    const leverageType = getLeverageType(token)
    if (!baseToken || !token.address || leverageType === null) {
      return null
    }
    return {
      ...token,
      image: token.logoURI,
      baseToken: baseToken.symbol,
      leverageType,
    }
  })
  return tokens.filter((token): token is LeverageToken => token !== null)
}

function getDefaultMarketAsset(market: string) {
  switch (market) {
    case 'BTC / USD':
      return { symbol: 'BTC2x', chainId: mainnet.id }
    case 'ETH / USD':
      return { symbol: 'ETH2x', chainId: mainnet.id }
    case 'ETH / BTC':
      return { symbol: 'ETH2xBTC', chainId: arbitrum.id }
    case 'BTC / ETH':
      return { symbol: 'BTC2xETH', chainId: arbitrum.id }
    default:
      return null
  }
}

export function getPathForMarket(market: string, chainId?: number) {
  const existingMarket = markets.find((m) => m.market === market)
  if (!existingMarket) return null

  const defaultAsset = getDefaultMarketAsset(market)
  if (!defaultAsset) return null

  const queryChainId =
    chainId && existingMarket.networks.some((network) => network.id === chainId)
      ? chainId
      : defaultAsset.chainId
  return `/leverage?sell=ETH&buy=${defaultAsset.symbol}&network=${queryChainId}`
}

export function getDefaultRatioAsset(strategy: string) {
  switch (strategy.toLowerCase()) {
    case '2x':
      return { symbol: 'ETH2x', chainId: base.id }
    case '3x':
      return { symbol: 'ETH3x', chainId: base.id }
    case '-1x':
      return { symbol: 'iETH1x', chainId: arbitrum.id }
    default:
      return null
  }
}

export const getPathForRatio = (
  strategy: string,
  isConnected: boolean,
  chainId?: number,
): string | null => {
  const existingRatio = ratios.find((r) => r.strategy === strategy)
  if (!existingRatio) return null

  const defaultAsset = getDefaultRatioAsset(strategy)
  if (!defaultAsset) return null

  if (!isConnected) {
    return `/leverage?sell=ETH&buy=${defaultAsset.symbol}&network=${defaultAsset.chainId}`
  }

  if (!existingRatio.networks.some((network) => network.id === chainId)) {
    return null
  }

  return `/leverage?sell=ETH&buy=${defaultAsset.symbol}&network=${chainId}`
}

export const markets: Market[] = [
  {
    icon: '/assets/eth-usd-market.svg',
    market: 'ETH / USD',
    symbol: 'ETH',
    currency: 'USD',
    networks: [mainnet, arbitrum, base],
    price: 0,
    change24h: 0,
  },
  {
    icon: '/assets/btc-usd-market.svg',
    market: 'BTC / USD',
    symbol: 'BTC',
    currency: 'USD',
    networks: [mainnet, arbitrum, base],
    price: 0,
    change24h: 0,
  },
  {
    icon: '/assets/eth-btc-market.svg',
    market: 'ETH / BTC',
    symbol: 'ETH',
    currency: 'BTC',
    networks: [arbitrum],
    price: 0,
    change24h: 0,
  },
  {
    icon: '/assets/btc-eth-market.svg',
    market: 'BTC / ETH',
    symbol: 'BTC',
    currency: 'ETH',
    networks: [arbitrum],
    price: 0,
    change24h: 0,
  },
]

export const ratios: LeverageRatio[] = [
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'ETH2X').logoURI,
    strategy: '2x',
    networks: [arbitrum, base, mainnet],
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'ETH3X').logoURI,
    strategy: '3x',
    networks: [arbitrum, base],
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'iBTC1X').logoURI,
    strategy: '-1x',
    networks: [arbitrum],
  },
]

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
