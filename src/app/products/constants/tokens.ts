import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { arbitrum, mainnet } from 'viem/chains'

import {
  buildEarnTradePath,
  buildLegacyPath,
  buildLeverageTradePath,
  buildSwapTradePath,
} from '@/app/products/utils/trade-path'

import type { ProductRow } from '@/app/products/types/product'

export const productTokens: ProductRow[] = [
  {
    ...getTokenByChainAndSymbol(arbitrum.id, 'iETH1X'),
    hasApy: false,
    listType: 'Leverage',
    tradeHref: buildLeverageTradePath('iETH1X', undefined, arbitrum.id),
  },
  {
    ...getTokenByChainAndSymbol(arbitrum.id, 'ETH2X'),
    hasApy: false,
    listType: 'Leverage',
    tradeHref: buildLeverageTradePath('ETH2X', undefined, arbitrum.id),
  },
  {
    ...getTokenByChainAndSymbol(arbitrum.id, 'ETH3X'),
    hasApy: false,
    listType: 'Leverage',
    tradeHref: buildLeverageTradePath('ETH3X', undefined, arbitrum.id),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'hyETH'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('hyETH'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'icETH'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('icETH'),
  },
  {
    ...getTokenByChainAndSymbol(arbitrum.id, 'iBTC1X'),
    hasApy: false,
    listType: 'Leverage',
    tradeHref: buildLeverageTradePath('iBTC1X', undefined, arbitrum.id),
  },
  {
    ...getTokenByChainAndSymbol(arbitrum.id, 'BTC2X'),
    hasApy: false,
    listType: 'Leverage',
    tradeHref: buildLeverageTradePath('BTC2X', undefined, arbitrum.id),
  },
  {
    ...getTokenByChainAndSymbol(arbitrum.id, 'BTC3X'),
    hasApy: false,
    listType: 'Leverage',
    tradeHref: buildLeverageTradePath('BTC3X', undefined, arbitrum.id),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'BED'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildLegacyPath(),
  },
  {
    ...getTokenByChainAndSymbol(arbitrum.id, 'ETH2xBTC'),
    hasApy: false,
    listType: 'Leverage',
    tradeHref: buildLeverageTradePath('ETH2xBTC', undefined, arbitrum.id),
  },
  {
    ...getTokenByChainAndSymbol(arbitrum.id, 'BTC2xETH'),
    hasApy: false,
    listType: 'Leverage',
    tradeHref: buildLeverageTradePath('BTC2xETH', undefined, arbitrum.id),
  },
  // Readd DPI and MVI for now for users.
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'DPI'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('dpi'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'MVI'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('mvi'),
  },
]
