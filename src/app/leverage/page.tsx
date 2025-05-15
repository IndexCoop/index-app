'use client'

import { useEffect, useState } from 'react'

import { LeverageOnboardingPopup } from '@/app/leverage/components/leverage-onboarding-popup'
import { LeveragePanel } from '@/app/leverage/components/leverage-panel'

import { FaqSection } from './components/faq-section'

export default function Page() {
  const [isPopupOpen, setIsPopupOpen] = useState(true)

  useEffect(() => {
    document.body.classList.add('dark', 'bg-zinc-950')
    return () => {
      document.body.classList.remove('dark', 'bg-zinc-950')
    }
  }, [])

  return (
    <div className='mx-auto flex max-w-screen-2xl justify-center'>
      <div className='flex w-full flex-col items-center'>
        <div className='mx-auto flex w-full flex-col gap-4 px-4 py-4 md:gap-6 md:py-6'>
          <LeveragePanel />
          <FaqSection />
        </div>
      </div>
      <LeverageOnboardingPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onGetStarted={() => {
          setIsPopupOpen(false)
        }}
      />
    </div>
  )
}
