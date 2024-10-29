import { ProductRowItemDesktop } from '@/app/(light)/products/components/product-row-item/product-row-item-desktop'
import { ProductRowItemMobile } from '@/app/(light)/products/components/product-row-item/product-row-item-mobile'
import { ProductRow } from '@/app/(light)/products/types/product'

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
