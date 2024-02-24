import { ProductTheme, ProductType } from '@/app/products/types/product'
import { getTokenBySymbol } from '@/lib/utils/tokens'

export const productTokens = [
  {
    ...getTokenBySymbol('eth2x-fli'),
    hasApy: false,
    shouldUseAnalytics: false,
    theme: ProductTheme.ETH,
    type: ProductType.LEVERAGE,
  },
  {
    ...getTokenBySymbol('dpi'),
    hasApy: false,
    shouldUseAnalytics: false,
    theme: ProductTheme.DEFI,
    type: ProductType.INDEX,
  },
  {
    ...getTokenBySymbol('iceth'),
    hasApy: true,
    shouldUseAnalytics: false,
    theme: ProductTheme.ETH,
    type: ProductType.YIELD,
  },
  {
    ...getTokenBySymbol('mvi'),
    hasApy: false,
    shouldUseAnalytics: false,
    theme: ProductTheme.METAVERSE,
    type: ProductType.INDEX,
  },
  {
    ...getTokenBySymbol('btc2x-fli'),
    hasApy: false,
    shouldUseAnalytics: false,
    theme: ProductTheme.BTC,
    type: ProductType.LEVERAGE,
  },
  {
    ...getTokenBySymbol('dseth'),
    hasApy: true,
    shouldUseAnalytics: false,
    theme: ProductTheme.ETH,
    type: ProductType.YIELD,
  },
  {
    ...getTokenBySymbol('ic21'),
    hasApy: false,
    shouldUseAnalytics: false,
    theme: ProductTheme.LCAP,
    type: ProductType.INDEX,
  },
  {
    ...getTokenBySymbol('gtceth'),
    hasApy: true,
    shouldUseAnalytics: false,
    theme: ProductTheme.ETH,
    type: ProductType.YIELD,
  },
  {
    ...getTokenBySymbol('cdeti'),
    shouldUseAnalytics: true,
    hasApy: false,
    theme: ProductTheme.ETH,
    type: ProductType.INDEX,
  },
]
