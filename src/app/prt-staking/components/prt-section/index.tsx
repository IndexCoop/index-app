import { Disclaimer } from '@/app/prt-staking/components/prt-section/disclaimer'
import { PrtCard } from '@/app/prt-staking/components/prt-section/prt-card'
import { prts } from '@/app/prt-staking/constants'

export function PrtSection() {
  return (
    <div className='py-10'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {prts.map((prt) => (
          <PrtCard key={prt.tokenData.symbol} token={prt} />
        ))}
      </div>
      <Disclaimer />
    </div>
  )
}
