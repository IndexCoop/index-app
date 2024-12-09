import { ProductRow } from '@/app/products/types/product'
import {
  buildEarnTradePath,
  buildLeverageTradePath,
  buildSwapTradePath,
} from '@/app/products/utils/trade-path'
import { BASE } from '@/constants/chains'
import { getTokenBySymbol } from '@/lib/utils/tokens'

export const productTokens: ProductRow[] = [
  {
    ...getTokenBySymbol('eth2x'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildLeverageTradePath('eth2x'),
  },
  {
    ...getTokenBySymbol('dpi'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('dpi'),
  },
  {
    ...getTokenBySymbol('hyeth'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('hyETH'),
  },
  {
    ...getTokenBySymbol('iceth'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('icETH'),
  },
  {
    ...getTokenBySymbol('mvi'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('mvi'),
  },
  {
    ...getTokenBySymbol('btc2x'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildLeverageTradePath('btc2x'),
  },
  {
    ...getTokenBySymbol('dseth'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('dsETH'),
  },
  {
    ...getTokenBySymbol('bed'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('bed'),
  },
  {
    ...getTokenBySymbol('icusd'),
    hasApy: true,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('icUSD', 'USDC', BASE.chainId),
  },
  {
    ...getTokenBySymbol('cdeti'),
    hasApy: false,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('cdeti'),
  },
]
