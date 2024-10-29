import { ProductRow } from '@/app/(light)/products/types/product'
import { SortBy, SortDirection } from '@/app/(light)/products/types/sort'

function sortProductsByString(
  products: ProductRow[],
  sortBy: keyof ProductRow,
  sortDirection: string,
) {
  return [
    ...products.sort((a, b) => {
      const aVal = (a[sortBy] as string).toUpperCase()
      const bVal = (b[sortBy] as string).toUpperCase()
      if (sortDirection === SortDirection.ASC) {
        return aVal < bVal ? -1 : bVal > aVal ? 1 : 0
      }
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }),
  ]
}

function sortProductsByNumber(
  products: ProductRow[],
  sortBy: keyof ProductRow,
  sortDirection: string,
) {
  return [
    ...products.sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      if (aVal === undefined || aVal === null) return 1
      if (bVal === undefined || bVal === null) return -1

      if (sortDirection === SortDirection.ASC) {
        return aVal < bVal ? -1 : bVal > aVal ? 1 : 0
      }
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }),
  ]
}

export function sortProducts(
  products: ProductRow[],
  sortBy: string | null,
  sortDirection: string,
) {
  if (sortBy === null) return products

  switch (sortBy) {
    case SortBy.APY:
    case SortBy.Delta:
    case SortBy.Price:
    case SortBy.TVL:
      return sortProductsByNumber(products, sortBy, sortDirection)
    case SortBy.Product:
    case SortBy.Theme:
    case SortBy.Type:
      return sortProductsByString(products, sortBy, sortDirection)
    default:
      console.warn(`Unknown sort key [${sortBy}]`)
      return products
  }
}
