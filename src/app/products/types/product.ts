export type ProductListType = 'Earn' | 'Strategies'

export type ProductRow = {
  address?: string
  hasApy: boolean
  logoURI?: string
  symbol?: string
  name?: string
  listType: ProductListType
  tradeHref: string
  price?: number
  delta?: number
  apy?: number | null
  tvl?: number
}
