import { FaqSection } from '@/app/prt-staking/components/faq-section'
import { HeroSection } from '@/app/prt-staking/components/hero-section'
import { PrtSection } from '@/app/prt-staking/components/prt-section'

export default function Page() {
  return (
    <div className='mx-auto max-w-5xl px-2 py-12 sm:px-4 md:px-8 md:py-16 lg:px-12'>
      <HeroSection />
      <PrtSection />
      <FaqSection />
    </div>
  )
}
