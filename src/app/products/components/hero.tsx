'use client'

import Link from 'next/link'

import { Path } from '@/constants/paths'
import { useAnalytics } from '@/lib/hooks/use-analytics'

export function Hero() {
  const { logEvent } = useAnalytics()
  return (
    <div className='flex flex-col items-center space-y-10 md:space-y-12'>
      <h2 className='text-ic-gray-800 max-w-3xl text-center text-3xl font-bold md:text-4xl lg:text-5xl lg:leading-tight'>
        Crypto is complex.
        <br />
        Our products make it simple.
      </h2>
      <h3 className='text-ic-gray-500 max-w-lg text-center text-sm font-medium md:text-base'>
        Unlock powerful sector, leverage and yield strategies with our simple
        tokens.
      </h3>
      <Link
        className='bg-ic-blue-500 text-ic-white hover:bg-ic-blue-400 rounded-lg px-11 py-3'
        href={Path.TRADE}
        onClick={() =>
          logEvent('Trade Now Button Clicked', { context: 'Hero' })
        }
      >
        Trade Now
      </Link>
    </div>
  )
}
