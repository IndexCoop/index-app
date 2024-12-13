import { Hero } from '@/app/products/components/hero'
import { ProductPanel } from '@/app/products/components/product-panel'

export default function Page() {
  return (
    <div className='mx-auto max-w-7xl px-8 py-16 md:py-20 lg:px-12'>
      <Hero />
      <ProductPanel />
    </div>
  )
}
