'use client'

import { LegacyHeader } from '@/app/legacy/components/legacy-header'
import { RedeemWidget } from './components/redeem-widget'

export default function Page() {
  return (
    <div className='mx-auto max-w-xl px-4 py-16'>
      <div className='flex w-full flex-col'>
        <LegacyHeader />
        <RedeemWidget />
      </div>
    </div>
  )
}
