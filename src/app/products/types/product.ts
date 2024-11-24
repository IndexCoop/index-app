export enum ProductType {
  LEVERAGE = 'Leverage',
  INDEX = 'Index',
  YIELD = 'Yield',
}

export enum ProductTheme {
  BTC = 'BTC',
  DEFI = 'DeFi',
  ETH = 'ETH',
  LCAP = 'Lcap',
  METAVERSE = 'Metaverse',
}

export type ProductListType = 'Earn' | 'Strategies'

export type ProductRow = {
  address?: string
  hasApy: boolean
  image?: string
  symbol?: string
  name?: string
  listType: ProductListType
  tradeHref: string
  type: ProductType
  theme: ProductTheme
  price?: number
  delta?: number
  apy?: number | null
  tvl?: number
}
