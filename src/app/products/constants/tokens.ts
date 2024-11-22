import {
  ProductRow,
  ProductTheme,
  ProductType,
} from '@/app/products/types/product'
import { getTokenBySymbol } from '@/lib/utils/tokens'

export const productTokens: ProductRow[] = [
  {
    ...getTokenBySymbol('eth2x'),
    hasApy: false,
    theme: ProductTheme.ETH,
    listType: 'Strategies',
    type: ProductType.LEVERAGE,
  },
  {
    ...getTokenBySymbol('dpi'),
    hasApy: false,
    theme: ProductTheme.DEFI,
    listType: 'Strategies',
    type: ProductType.INDEX,
  },
  {
    ...getTokenBySymbol('hyeth'),
    hasApy: true,
    theme: ProductTheme.ETH,
    listType: 'Earn',
    type: ProductType.YIELD,
  },
  {
    ...getTokenBySymbol('iceth'),
    hasApy: true,
    theme: ProductTheme.ETH,
    listType: 'Earn',
    type: ProductType.YIELD,
  },
  {
    ...getTokenBySymbol('mvi'),
    hasApy: false,
    theme: ProductTheme.METAVERSE,
    listType: 'Strategies',
    type: ProductType.INDEX,
  },
  {
    ...getTokenBySymbol('btc2x'),
    hasApy: false,
    theme: ProductTheme.BTC,
    listType: 'Strategies',
    type: ProductType.LEVERAGE,
  },
  {
    ...getTokenBySymbol('dseth'),
    hasApy: true,
    theme: ProductTheme.ETH,
    listType: 'Earn',
    type: ProductType.YIELD,
  },
  {
    ...getTokenBySymbol('bed'),
    hasApy: false,
    theme: ProductTheme.DEFI,
    listType: 'Strategies',
    type: ProductType.INDEX,
  },
  {
    ...getTokenBySymbol('gtceth'),
    hasApy: true,
    theme: ProductTheme.ETH,
    listType: 'Earn',
    type: ProductType.YIELD,
  },
  {
    ...getTokenBySymbol('cdeti'),
    hasApy: false,
    listType: 'Strategies',
    theme: ProductTheme.ETH,
    type: ProductType.INDEX,
  },
]
