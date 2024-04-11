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

export type ProductRow = {
  hasApy: boolean
  image?: string
  symbol?: string
  name?: string
  type: ProductType
  theme: ProductTheme
  price?: number
  delta?: number
  apy?: number | null
  tvl?: number
}
