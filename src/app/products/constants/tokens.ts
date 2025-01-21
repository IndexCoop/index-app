import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { arbitrum, base, mainnet } from 'viem/chains'

import { ProductRow } from '@/app/products/types/product'
import {
  buildEarnTradePath,
  buildLegacyPath,
  buildLeverageTradePath,
  buildSwapTradePath,
} from '@/app/products/utils/trade-path'

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
    ...getTokenByChainAndSymbol(mainnet.id, 'dsETH'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('dsETH'),
  },
  {
    ...getTokenByChainAndSymbol(mainnet.id, 'BED'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildLegacyPath(),
  },
  {
    ...getTokenByChainAndSymbol(base.id, 'icUSD'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('icUSD', 'USDC', base.id),
    digits: 4,
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
