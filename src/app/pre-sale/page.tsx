import { FaqSection } from './components/faq-section'
import { HeroSection } from './components/hero-section'
import { PreSaleSection } from './components/pre-sale-section'

export default function Page() {
  return (
    <div className='px-2 sm:px-4 md:px-8 lg:px-12 py-12 md:py-16 max-w-5xl mx-auto'>
      <HeroSection />
      <PreSaleSection />
      <FaqSection />
    </div>
  )
}
