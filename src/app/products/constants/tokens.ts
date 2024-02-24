import { ProductTheme, ProductType } from '@/app/products/types/product'
import { getTokenFromSymbol } from '@/app/products/utils/tokens'

export const productTokens = [
  {
    ...getTokenFromSymbol('eth2x-fli'),
    hasApy: false,
    shouldUseAnalytics: false,
    theme: ProductTheme.ETH,
    type: ProductType.LEVERAGE,
  },
  {
    ...getTokenFromSymbol('dpi'),
    hasApy: false,
    shouldUseAnalytics: false,
    theme: ProductTheme.DEFI,
    type: ProductType.INDEX,
  },
  {
    ...getTokenFromSymbol('iceth'),
    hasApy: true,
    shouldUseAnalytics: false,
    theme: ProductTheme.ETH,
    type: ProductType.YIELD,
  },
  {
    ...getTokenFromSymbol('mvi'),
    hasApy: false,
    shouldUseAnalytics: false,
    theme: ProductTheme.METAVERSE,
    type: ProductType.INDEX,
  },
  {
    ...getTokenFromSymbol('btc2x-fli'),
    hasApy: false,
    shouldUseAnalytics: false,
    theme: ProductTheme.BTC,
    type: ProductType.LEVERAGE,
  },
  {
    ...getTokenFromSymbol('dseth'),
    hasApy: true,
    shouldUseAnalytics: false,
    theme: ProductTheme.ETH,
    type: ProductType.YIELD,
  },
  {
    ...getTokenFromSymbol('ic21'),
    hasApy: false,
    shouldUseAnalytics: false,
    theme: ProductTheme.LCAP,
    type: ProductType.INDEX,
  },
  {
    ...getTokenFromSymbol('gtceth'),
    hasApy: true,
    shouldUseAnalytics: false,
    theme: ProductTheme.ETH,
    type: ProductType.YIELD,
  },
  {
    ...getTokenFromSymbol('cdeti'),
    shouldUseAnalytics: true,
    hasApy: false,
    theme: ProductTheme.ETH,
    type: ProductType.INDEX,
  },
]
