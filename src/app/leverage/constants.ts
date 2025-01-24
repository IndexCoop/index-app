import {
  getTokenByChainAndSymbol,
  isLeverageToken,
} from '@indexcoop/tokenlists'
import { arbitrum, base, mainnet } from 'viem/chains'

import { getLeverageBaseToken } from '@/app/leverage/utils/get-leverage-base-token'
import { getLeverageType } from '@/app/leverage/utils/get-leverage-type'
import { ARBITRUM, BASE, MAINNET } from '@/constants/chains'
import { BTC, ETH, Token, USDC, USDT, WBTC, WETH } from '@/constants/tokens'

import { LeverageToken, LeverageType, Market } from './types'

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
      return 'BTC2x'
    case 'ETH / BTC':
      return 'ETH2xBTC'
    case 'BTC / ETH':
      return 'BTC2xETH'
    default:
      return 'ETH2x'
  }
}

export function getDefaultPathForMarket(market: string, chainId: number) {
  const existingMarket = markets.find(
    (m) => m.market.toLowerCase() === market.toLowerCase(),
  )
  if (!existingMarket) return null
  const defaultAsset = getDefaultMarketAsset(market)
  return `/leverage?sell=ETH&buy=${defaultAsset}&network=${chainId}`
}

export const markets: Market[] = [
  {
    icon: '/assets/eth-usd-market.svg',
    market: 'ETH / USD',
    networks: [mainnet, arbitrum, base],
  },
  {
    icon: '/assets/btc-usd-market.svg',
    market: 'BTC / USD',
    networks: [mainnet, arbitrum, base],
  },
  {
    icon: '/assets/eth-btc-market.svg',
    market: 'ETH / BTC',
    networks: [arbitrum],
  },
  {
    icon: '/assets/btc-eth-market.svg',
    market: 'BTC / ETH',
    networks: [arbitrum],
  },
]

export function getMarketsForChain(chainId: number) {
  switch (chainId) {
    case arbitrum.id:
      return
    case base.id:
      return [
        {
          icon: '/assets/selector-base-asset-eth.svg',
          market: 'ETH / USD',
          priceRatio: '$3,712.23',
          collateral: 'ETH',
          debt: 'USDC',
        },
      ]
    default:
      return [
        {
          icon: '/assets/selector-base-asset-eth.svg',
          market: 'ETH / USD',
          priceRatio: '$3,712.23',
          collateral: 'ETH',
          debt: 'USDC',
        },
        {
          icon: BTC.image,
          market: 'BTC / USD',
          priceRatio: '$94,712.40',
          collateral: 'BTC',
          debt: 'USDC',
        },
      ]
  }
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
