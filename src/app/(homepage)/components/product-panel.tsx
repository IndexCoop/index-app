import { ProductList } from '@/app/(homepage)/components/product-list'

export function ProductPanel() {
  return (
    <div className='flex flex-col my-12 mx-auto max-w-screen-2xl'>
      <span id='product-scroll' className='text-ic-gray-950 font-semibold'>
        All Products
      </span>
      <ProductList />
    </div>
  )
}
