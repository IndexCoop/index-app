import { Hero } from '@/app/products/components/hero'
import { ProductPanel } from '@/app/products/components/product-panel'

export default function Page() {
  return (
    <div className='px-2 sm:px-4 md:px-8 lg:px-12 py-16 md:py-20'>
      <Hero />
      <ProductPanel />
    </div>
  )
}
