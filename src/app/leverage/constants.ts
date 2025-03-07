import {
  getTokenByChainAndSymbol,
  isLeverageToken,
} from '@indexcoop/tokenlists'
import { arbitrum, base, mainnet } from 'viem/chains'

import { getLeverageBaseToken } from '@/app/leverage/utils/get-leverage-base-token'
import { getLeverageType } from '@/app/leverage/utils/get-leverage-type'
import { ARBITRUM, BASE, MAINNET } from '@/constants/chains'
import { ETH, type Token, USDC, USDT, WBTC, WETH } from '@/constants/tokens'

import {
  LeverageMarket,
  type LeverageRatio,
  LeverageStrategy,
  type LeverageToken,
  LeverageType,
  type Market,
} from './types'

export enum LendingProtocol {
  aave = 'aave',
  morpho = 'morpho',
}

const cbBTC = getTokenByChainAndSymbol(base.id, 'cbBTC')

export const ethLeverageTokenSymbols = ['ETH2X', 'ETH3X', 'iETH1X', 'ETH2xBTC']

export const btcLeverageTokenSymbols = ['BTC2X', 'BTC3X', 'iBTC1X', 'BTC2xETH']

export const leverageTokens = [
  ...ethLeverageTokenSymbols,
  ...btcLeverageTokenSymbols,
  'uSOL2x',
  'uSUI2x',
]

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

export function getPathForMarket(market: string, chainId?: number) {
  const existingMarket = markets.find((m) => m.market === market)
  if (!existingMarket) return null

  const { defaultAsset } = existingMarket

  const queryChainId =
    chainId && existingMarket.networks.some((network) => network.id === chainId)
      ? chainId
      : defaultAsset.chainId
  return `/leverage?sell=ETH&buy=${defaultAsset.symbol}&network=${queryChainId}`
}

const defaultAssets = {
  [LeverageMarket.BTCUSD]: {
    [LeverageStrategy.Long2x]: { symbol: 'BTC2X', chainId: base.id },
    [LeverageStrategy.Long3x]: { symbol: 'BTC3X', chainId: base.id },
    [LeverageStrategy.Short1x]: { symbol: 'iBTC1X', chainId: arbitrum.id },
  },
  [LeverageMarket.ETHUSD]: {
    [LeverageStrategy.Long2x]: { symbol: 'ETH2X', chainId: base.id },
    [LeverageStrategy.Long3x]: { symbol: 'ETH3X', chainId: base.id },
    [LeverageStrategy.Short1x]: { symbol: 'iETH1X', chainId: arbitrum.id },
  },
  [LeverageMarket.BTCETH]: {
    [LeverageStrategy.Long2x]: { symbol: 'BTC2xETH', chainId: arbitrum.id },
  },
  [LeverageMarket.ETHBTC]: {
    [LeverageStrategy.Long2x]: { symbol: 'ETH2xBTC', chainId: arbitrum.id },
  },
  [LeverageMarket.SOLUSD]: {
    [LeverageStrategy.Long2x]: { symbol: 'uSOL2x', chainId: base.id },
  },
  [LeverageMarket.SUIUSD]: {
    [LeverageStrategy.Long2x]: { symbol: 'uSUI2x', chainId: base.id },
  },
} as Record<
  LeverageMarket,
  Record<LeverageStrategy, { symbol: string; chainId: number }>
>

export function getDefaultRatioAsset(
  strategy: LeverageStrategy,
  market: LeverageMarket,
) {
  const defaultAsset = defaultAssets[market][strategy]
  return defaultAsset ?? null
}

export const getPathForRatio = (
  ratioItem: LeverageRatio,
  isConnected: boolean,
  chainId?: number,
): string | null => {
  const { market, strategy } = ratioItem

  const strategyRatios = ratios.filter((r) => r.strategy === strategy)
  if (strategyRatios.length === 0) return null

  const defaultAsset = getDefaultRatioAsset(strategy, market)
  if (!defaultAsset) return null

  if (
    !isConnected ||
    !strategyRatios.some((ratio) => ratio.chain.id === chainId)
  ) {
    return `/leverage?sell=ETH&buy=${defaultAsset.symbol}&network=${defaultAsset.chainId}`
  }

  return `/leverage?sell=ETH&buy=${defaultAsset.symbol}&network=${chainId}`
}

export const markets: Market[] = [
  {
    icon: '/assets/eth-usd-market.svg',
    market: LeverageMarket.ETHUSD,
    symbol: 'ETH',
    currency: 'USD',
    networks: [mainnet, arbitrum, base],
    price: 0,
    change24h: 0,
    low24h: 0,
    high24h: 0,
    defaultAsset: { symbol: 'ETH3X', chainId: base.id },
    lendingProtocol: LendingProtocol.aave,
  },
  {
    icon: '/assets/btc-usd-market.svg',
    market: LeverageMarket.BTCUSD,
    symbol: 'BTC',
    currency: 'USD',
    networks: [mainnet, arbitrum, base],
    price: 0,
    change24h: 0,
    low24h: 0,
    high24h: 0,
    defaultAsset: { symbol: 'BTC3X', chainId: base.id },
    lendingProtocol: LendingProtocol.aave,
  },
  {
    icon: '/assets/sol-usd-market.svg',
    market: LeverageMarket.SOLUSD,
    symbol: 'SOL',
    currency: 'USD',
    networks: [base],
    price: 0,
    change24h: 0,
    low24h: 0,
    high24h: 0,
    defaultAsset: { symbol: 'uSOL2x', chainId: base.id },
    lendingProtocol: LendingProtocol.morpho,
  },
  {
    icon: '/assets/sui-usd-market.svg',
    market: LeverageMarket.SUIUSD,
    symbol: 'SUI',
    currency: 'USD',
    networks: [base],
    price: 0,
    change24h: 0,
    low24h: 0,
    high24h: 0,
    defaultAsset: { symbol: 'uSUI2x', chainId: base.id },
    lendingProtocol: LendingProtocol.morpho,
  },
  {
    icon: '/assets/eth-btc-market.svg',
    market: LeverageMarket.ETHBTC,
    symbol: 'ETH',
    currency: 'BTC',
    networks: [arbitrum],
    price: 0,
    change24h: 0,
    low24h: 0,
    high24h: 0,
    defaultAsset: { symbol: 'ETH2xBTC', chainId: arbitrum.id },
    lendingProtocol: LendingProtocol.aave,
  },
  {
    icon: '/assets/btc-eth-market.svg',
    market: LeverageMarket.BTCETH,
    symbol: 'BTC',
    currency: 'ETH',
    networks: [arbitrum],
    price: 0,
    change24h: 0,
    low24h: 0,
    high24h: 0,
    defaultAsset: { symbol: 'BTC2xETH', chainId: arbitrum.id },
    lendingProtocol: LendingProtocol.aave,
  },
]

export const ratios: LeverageRatio[] = [
  {
    icon: getTokenByChainAndSymbol(mainnet.id, 'BTC2X').logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Long2x,
    chain: mainnet,
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'BTC2X').logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Long2x,
    chain: arbitrum,
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'BTC3X').logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Long3x,
    chain: arbitrum,
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'iBTC1X').logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Short1x,
    chain: arbitrum,
  },
  {
    icon: getTokenByChainAndSymbol(base.id, 'BTC2X').logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Long2x,
    chain: base,
  },
  {
    icon: getTokenByChainAndSymbol(base.id, 'BTC3X').logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Long3x,
    chain: base,
  },
  {
    icon: getTokenByChainAndSymbol(mainnet.id, 'ETH2X').logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Long2x,
    chain: mainnet,
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'ETH2X').logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Long2x,
    chain: arbitrum,
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'ETH3X').logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Long3x,
    chain: arbitrum,
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'iETH1X').logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Short1x,
    chain: arbitrum,
  },
  {
    icon: getTokenByChainAndSymbol(base.id, 'ETH2X').logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Long2x,
    chain: base,
  },
  {
    icon: getTokenByChainAndSymbol(base.id, 'ETH3X').logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Long3x,
    chain: base,
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'BTC2xETH').logoURI,
    market: LeverageMarket.BTCETH,
    strategy: LeverageStrategy.Long2x,
    chain: arbitrum,
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'ETH2xBTC').logoURI,
    market: LeverageMarket.ETHBTC,
    strategy: LeverageStrategy.Long2x,
    chain: arbitrum,
  },
  {
    icon: getTokenByChainAndSymbol(base.id, 'uSOL2x').logoURI,
    market: LeverageMarket.SOLUSD,
    strategy: LeverageStrategy.Long2x,
    chain: base,
  },
  {
    icon: getTokenByChainAndSymbol(base.id, 'uSUI2x').logoURI,
    market: LeverageMarket.SUIUSD,
    strategy: LeverageStrategy.Long2x,
    chain: base,
  },
].sort((a, b) => {
  const strategyOrder = {
    [LeverageStrategy.Long3x]: 1,
    [LeverageStrategy.Long2x]: 2,
    [LeverageStrategy.Short1x]: 3,
  }
  return strategyOrder[a.strategy] - strategyOrder[b.strategy]
})

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
