import Link from 'next/link'
import { Path } from '@/constants/paths'

export function Hero() {
  return (
    <div className='flex flex-col items-center space-y-10 md:space-y-12'>
      <h2 className='text-ic-gray-800 text-3xl md:text-4xl lg:text-5xl font-bold text-center max-w-3xl lg:leading-tight'>
        Crypto is complex.<br />Our products make it simple.
      </h2>
      <h3 className='text-ic-gray-500 font-medium text-sm md:text-base text-center max-w-lg'>
        Unlock powerful sector, leverage and yield strategies with our simple
        tokens.
      </h3>
      <Link
        className='bg-ic-blue-500 text-ic-white px-11 py-3 rounded-lg hover:bg-ic-blue-400'
        href={Path.TRADE}
      >
        Trade Now
      </Link>
    </div>
  )
}
