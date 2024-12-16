import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { arbitrum, base, mainnet } from 'viem/chains'

import { ProductRow } from '@/app/products/types/product'
import {
  buildEarnTradePath,
  buildLeverageTradePath,
  buildSwapTradePath,
} from '@/app/products/utils/trade-path'

export const productTokens: ProductRow[] = [
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'ETH2X'),
    hasApy: false,
    listType: 'Leverage',
    tradeHref: buildLeverageTradePath('ETH2X'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'DPI'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('dpi'),
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
    ...getTokenByChainAndSymbol(mainnet.id, 'MVI'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('mvi'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'BTC2X'),
    hasApy: false,
    listType: 'Leverage',
    tradeHref: buildLeverageTradePath('BTC2X'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'dsETH'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('dsETH'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'BED'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('bed'),
  },
  {
    ...getTokenByChainAndSymbol(base.id, 'icUSD'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('icUSD', 'USDC', base.id),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'cdETI'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('cdeti'),
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
]
