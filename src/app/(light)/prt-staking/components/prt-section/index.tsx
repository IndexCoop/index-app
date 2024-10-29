'use client'

import { Disclaimer } from '@/app/(light)/prt-staking/components/prt-section/disclaimer'
import { PrtFrame } from '@/app/(light)/prt-staking/components/prt-section/prt-frame'
import { prts } from '@/app/(light)/prt-staking/constants'

export function PrtSection() {
  return (
    <div className='py-10'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {prts.map((prt) => (
          <PrtFrame key={prt.rewardTokenData.symbol} token={prt} />
        ))}
      </div>
      <Disclaimer />
    </div>
  )
}
