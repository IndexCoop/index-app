import { Hero } from '@/app/products/components/hero'
import { ProductPanel } from '@/app/products/components/product-panel'

export default function Page() {
  return (
    <div className='px-2 py-16 sm:px-4 md:px-8 md:py-20 lg:px-12'>
      <Hero />
      <ProductPanel />
    </div>
  )
}
