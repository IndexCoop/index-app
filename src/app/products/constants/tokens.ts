import {
  ProductRow,
  ProductTheme,
  ProductType,
} from '@/app/products/types/product'
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
    theme: ProductTheme.ETH,
    listType: 'Strategies',
    tradeHref: buildLeverageTradePath('eth2x'),
    type: ProductType.LEVERAGE,
  },
  {
    ...getTokenBySymbol('dpi'),
    hasApy: false,
    theme: ProductTheme.DEFI,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('dpi'),
    type: ProductType.INDEX,
  },
  {
    ...getTokenBySymbol('hyeth'),
    hasApy: true,
    theme: ProductTheme.ETH,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('hyETH'),
    type: ProductType.YIELD,
  },
  {
    ...getTokenBySymbol('iceth'),
    hasApy: true,
    theme: ProductTheme.ETH,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('icETH'),
    type: ProductType.YIELD,
  },
  {
    ...getTokenBySymbol('mvi'),
    hasApy: false,
    theme: ProductTheme.METAVERSE,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('mvi'),
    type: ProductType.INDEX,
  },
  {
    ...getTokenBySymbol('btc2x'),
    hasApy: false,
    theme: ProductTheme.BTC,
    listType: 'Strategies',
    tradeHref: buildLeverageTradePath('btc2x'),
    type: ProductType.LEVERAGE,
  },
  {
    ...getTokenBySymbol('dseth'),
    hasApy: true,
    theme: ProductTheme.ETH,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('dsETH'),
    type: ProductType.YIELD,
  },
  {
    ...getTokenBySymbol('bed'),
    hasApy: false,
    theme: ProductTheme.DEFI,
    listType: 'Strategies',
    tradeHref: buildSwapTradePath('bed'),
    type: ProductType.INDEX,
  },
  {
    ...getTokenBySymbol('icusd'),
    hasApy: true,
    theme: ProductTheme.ETH,
    listType: 'Earn',
    tradeHref: buildEarnTradePath('icusd', BASE.chainId),
    type: ProductType.YIELD,
  },
  {
    ...getTokenBySymbol('cdeti'),
    hasApy: false,
    listType: 'Strategies',
    theme: ProductTheme.ETH,
    tradeHref: buildSwapTradePath('cdeti'),
    type: ProductType.INDEX,
  },
]
