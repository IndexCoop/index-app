import { ProductList } from '@/app/products/components/product-list'

export function ProductPanel() {
  return (
    <div className='mx-auto my-12 flex max-w-screen-2xl flex-col'>
      <span className='text-ic-gray-950 font-semibold'>All Products</span>
      <ProductList />
    </div>
  )
}
