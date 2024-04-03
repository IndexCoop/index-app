import { FaqSection } from './components/faq-section'
import { HeroSection } from './components/hero-section'
import { MoreQuestions } from './components/more-questions'
import { PreSaleSection } from './components/pre-sale-section'

export default function Page() {
  return (
    <div className='mx-auto max-w-5xl px-2 py-12 sm:px-4 md:px-8 md:py-16 lg:px-12'>
      <HeroSection />
      <PreSaleSection />
      <FaqSection />
      <MoreQuestions />
    </div>
  )
}
