'use client'

import { RedeemWidget } from './components/redeem-widget'
import { RedeemProvider } from './providers/redeem-provider'

export default function Page() {
  return (
    <div className='mx-auto max-w-xl px-4 py-16'>
      <div className='w-full'>
        <RedeemProvider>
          <RedeemWidget />
        </RedeemProvider>
      </div>
    </div>
  )
}
