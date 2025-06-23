import {
  getTokenByChainAndSymbol,
  isLeverageToken,
} from '@indexcoop/tokenlists'
import { arbitrum, base, mainnet } from 'viem/chains'

import { getLeverageBaseToken } from '@/app/leverage/utils/get-leverage-base-token'
import { getLeverageType } from '@/app/leverage/utils/get-leverage-type'
import { ARBITRUM, BASE, MAINNET } from '@/constants/chains'
import { ETH, type Token, USDC, WBTC, WETH } from '@/constants/tokens'

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

// Lets get these here, the chain doesnt matter at this point.
const BTC2x = getTokenByChainAndSymbol(base.id, 'BTC2X')
const BTC3x = getTokenByChainAndSymbol(base.id, 'BTC3X')
const BTC2xETH = getTokenByChainAndSymbol(arbitrum.id, 'BTC2xETH')
const iBTC1X = getTokenByChainAndSymbol(arbitrum.id, 'iBTC1X')

const ETH2x = getTokenByChainAndSymbol(base.id, 'ETH2X')
const ETH3x = getTokenByChainAndSymbol(base.id, 'ETH3X')
const ETH2xBTC = getTokenByChainAndSymbol(arbitrum.id, 'ETH2xBTC')
const iETH1X = getTokenByChainAndSymbol(arbitrum.id, 'iETH1X')

const uSOL2x = getTokenByChainAndSymbol(base.id, 'uSOL2x')
const uSOL3x = getTokenByChainAndSymbol(base.id, 'uSOL3x')
const uSUI2x = getTokenByChainAndSymbol(base.id, 'uSUI2x')
const uSUI3x = getTokenByChainAndSymbol(base.id, 'uSUI3x')

const uXRP2x = getTokenByChainAndSymbol(base.id, 'uXRP2x')
const uXRP3x = getTokenByChainAndSymbol(base.id, 'uXRP3x')

const btcLeverageTokenSymbols = [BTC2x, BTC3x, iBTC1X, BTC2xETH].map(
  (token) => token.symbol,
)

const ethLeverageTokenSymbols = [ETH2x, ETH3x, iETH1X, ETH2xBTC].map(
  (token) => token.symbol,
)

const solLeverageTokenSymbols = [uSOL2x, uSOL3x].map((token) => token.symbol)
const suiLeverageTokenSymbols = [uSUI2x, uSUI3x].map((token) => token.symbol)
const xrpLeverageTokenSymbols = [uXRP2x, uXRP3x].map((token) => token.symbol)

export const leverageTokens = ([] as string[]).concat(
  btcLeverageTokenSymbols,
  ethLeverageTokenSymbols,
  solLeverageTokenSymbols,
  suiLeverageTokenSymbols,
  xrpLeverageTokenSymbols,
)

export function getCurrencyTokens(chainId: number): Token[] {
  switch (chainId) {
    case MAINNET.chainId:
    case ARBITRUM.chainId:
      return [ETH, WETH, WBTC, USDC]
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

  const { defaultAsset, defaultChainId } = existingMarket

  const queryChainId =
    chainId && existingMarket.networks.some((network) => network.id === chainId)
      ? chainId
      : defaultChainId
  return `/leverage?sell=ETH&buy=${defaultAsset[queryChainId]}&network=${queryChainId}`
}

const defaultAssets = {
  [LeverageMarket.BTCUSD]: {
    [LeverageStrategy.Long2x]: { symbol: BTC2x.symbol, chainId: base.id },
    [LeverageStrategy.Long3x]: { symbol: BTC3x.symbol, chainId: base.id },
    [LeverageStrategy.Short1x]: { symbol: iBTC1X.symbol, chainId: arbitrum.id },
  },
  [LeverageMarket.ETHUSD]: {
    [LeverageStrategy.Long2x]: { symbol: ETH2x.symbol, chainId: base.id },
    [LeverageStrategy.Long3x]: { symbol: ETH3x.symbol, chainId: base.id },
    [LeverageStrategy.Short1x]: { symbol: iETH1X.symbol, chainId: arbitrum.id },
  },
  [LeverageMarket.BTCETH]: {
    [LeverageStrategy.Long2x]: {
      symbol: BTC2xETH.symbol,
      chainId: arbitrum.id,
    },
  },
  [LeverageMarket.ETHBTC]: {
    [LeverageStrategy.Long2x]: {
      symbol: ETH2xBTC.symbol,
      chainId: arbitrum.id,
    },
  },
  [LeverageMarket.SOLUSD]: {
    [LeverageStrategy.Long2x]: { symbol: uSOL2x.symbol, chainId: base.id },
    [LeverageStrategy.Long3x]: { symbol: uSOL3x.symbol, chainId: base.id },
  },
  [LeverageMarket.SUIUSD]: {
    [LeverageStrategy.Long2x]: { symbol: uSUI2x.symbol, chainId: base.id },
    [LeverageStrategy.Long3x]: { symbol: uSUI3x.symbol, chainId: base.id },
  },
  [LeverageMarket.XRPUSD]: {
    [LeverageStrategy.Long2x]: { symbol: uXRP2x.symbol, chainId: base.id },
    [LeverageStrategy.Long3x]: { symbol: uXRP3x.symbol, chainId: base.id },
  },
} as Record<
  LeverageMarket,
  Record<LeverageStrategy, { symbol: string; chainId: number }>
>

function getDefaultRatioAsset(
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
    defaultAsset: {
      [arbitrum.id]: 'ETH3X',
      [base.id]: 'ETH3X',
      [mainnet.id]: 'ETH2X',
    },
    defaultChainId: base.id,
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
    defaultAsset: {
      [arbitrum.id]: 'BTC3X',
      [base.id]: 'BTC3X',
      [mainnet.id]: 'BTC2X',
    },
    defaultChainId: base.id,
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
    defaultAsset: {
      [base.id]: 'uSOL2x',
    },
    defaultChainId: base.id,
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
    defaultAsset: {
      [base.id]: 'uSUI2x',
    },
    defaultChainId: base.id,
    lendingProtocol: LendingProtocol.morpho,
  },
  {
    icon: '/assets/xrp-usd-market.svg',
    market: LeverageMarket.XRPUSD,
    symbol: 'XRP',
    currency: 'USD',
    networks: [base],
    price: 0,
    change24h: 0,
    low24h: 0,
    high24h: 0,
    defaultAsset: {
      [base.id]: 'uXRP2x',
    },
    defaultChainId: base.id,
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
    defaultAsset: {
      [arbitrum.id]: 'ETH2xBTC',
    },
    defaultChainId: arbitrum.id,
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
    defaultAsset: {
      [arbitrum.id]: 'BTC2xETH',
    },
    defaultChainId: arbitrum.id,
    lendingProtocol: LendingProtocol.aave,
  },
]

export const ratios: LeverageRatio[] = [
  {
    icon: BTC2x.logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Long2x,
    chain: mainnet,
  },
  {
    icon: BTC2x.logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Long2x,
    chain: arbitrum,
  },
  {
    icon: BTC3x.logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Long3x,
    chain: arbitrum,
  },
  {
    icon: iBTC1X.logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Short1x,
    chain: arbitrum,
  },
  {
    icon: BTC2x.logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Long2x,
    chain: base,
  },
  {
    icon: BTC3x.logoURI,
    market: LeverageMarket.BTCUSD,
    strategy: LeverageStrategy.Long3x,
    chain: base,
  },
  {
    icon: ETH2x.logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Long2x,
    chain: mainnet,
  },
  {
    icon: ETH2x.logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Long2x,
    chain: arbitrum,
  },
  {
    icon: ETH3x.logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Long3x,
    chain: arbitrum,
  },
  {
    icon: iETH1X.logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Short1x,
    chain: arbitrum,
  },
  {
    icon: ETH2x.logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Long2x,
    chain: base,
  },
  {
    icon: ETH3x.logoURI,
    market: LeverageMarket.ETHUSD,
    strategy: LeverageStrategy.Long3x,
    chain: base,
  },
  {
    icon: BTC2xETH.logoURI,
    market: LeverageMarket.BTCETH,
    strategy: LeverageStrategy.Long2x,
    chain: arbitrum,
  },
  {
    icon: ETH2xBTC.logoURI,
    market: LeverageMarket.ETHBTC,
    strategy: LeverageStrategy.Long2x,
    chain: arbitrum,
  },
  {
    icon: uSOL2x.logoURI,
    market: LeverageMarket.SOLUSD,
    strategy: LeverageStrategy.Long2x,
    chain: base,
  },
  {
    icon: uSOL3x.logoURI,
    market: LeverageMarket.SOLUSD,
    strategy: LeverageStrategy.Long3x,
    chain: base,
  },
  {
    icon: uSUI2x.logoURI,
    market: LeverageMarket.SUIUSD,
    strategy: LeverageStrategy.Long2x,
    chain: base,
  },
  {
    icon: uSUI3x.logoURI,
    market: LeverageMarket.SUIUSD,
    strategy: LeverageStrategy.Long3x,
    chain: base,
  },
  {
    icon: uXRP2x.logoURI,
    market: LeverageMarket.XRPUSD,
    strategy: LeverageStrategy.Long2x,
    chain: base,
  },
  {
    icon: uXRP3x.logoURI,
    market: LeverageMarket.XRPUSD,
    strategy: LeverageStrategy.Long3x,
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
