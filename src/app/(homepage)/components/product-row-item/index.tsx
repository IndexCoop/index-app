import { ProductRowItemDesktop } from '@/app/(homepage)/components/product-row-item/product-row-item-desktop'
import { ProductRowItemMobile } from '@/app/(homepage)/components/product-row-item/product-row-item-mobile'
import { ProductRow } from '@/app/(homepage)/types/product'

export type ProductRowItemProps = {
  isLoading: boolean
  product: ProductRow
}

export function ProductRowItem(props: ProductRowItemProps) {
  return (
    <>
      <ProductRowItemMobile {...props} />
      <ProductRowItemDesktop {...props} />
    </>
  )
}
