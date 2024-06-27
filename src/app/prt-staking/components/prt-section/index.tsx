import { prts } from '../../constants'

import { Disclaimer } from './disclaimer'
import { PrtCard } from './prt-card'

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
