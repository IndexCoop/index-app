import { headers } from 'next/headers'

import { LeverageOnboardingPopupWrapper } from '@/app/trade/components/leverage-onboarding-popup'
import { LeveragePanel } from '@/app/trade/components/leverage-panel'
import { getProtection } from '@/lib/utils/protection'

import { BodyClassEffect } from './components/body-class-effect'
import { FaqSection } from './components/faq-section'

export default async function Page() {
  const hdrs = headers()
  const headersObj = new Headers(hdrs)
  const { isNewUser } = await getProtection(headersObj)

  return (
    <>
      <BodyClassEffect />
      <div className='mx-auto flex max-w-screen-2xl justify-center'>
        <div className='flex w-full flex-col items-center'>
          <div className='mx-auto flex w-full flex-col gap-4 px-4 py-4 md:gap-6 md:py-6'>
            <LeveragePanel />
            <FaqSection />
          </div>
        </div>
        <LeverageOnboardingPopupWrapper showPopup={isNewUser} />
      </div>
    </>
  )
}
