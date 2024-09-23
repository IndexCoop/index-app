'use client'

import { FaqSection } from '@/app/legacy/components/faq-section'
import { LegacyHeader } from '@/app/legacy/components/legacy-header'
import { RedeemWidget } from './components/redeem-widget'

export default function Page() {
  return (
    <div className='mx-auto max-w-4xl px-4 py-16'>
      <div className='flex w-full flex-col gap-8'>
        <LegacyHeader />
        <RedeemWidget />
        <FaqSection />
      </div>
    </div>
  )
}
