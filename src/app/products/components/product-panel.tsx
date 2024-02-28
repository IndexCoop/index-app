import { ProductList } from '@/app/products/components/product-list'

export function ProductPanel() {
  return (
    <div className='flex flex-col my-12 mx-auto max-w-screen-2xl'>
      <span className='text-ic-gray-950 font-semibold'>
        All Products
      </span>
      <ProductList />
    </div>
  )
}
