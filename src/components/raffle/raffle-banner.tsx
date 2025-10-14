import { Button } from '@headlessui/react'

import { withEpoch } from '@/components/raffle/with-epoch'

export const RaffleBanner = withEpoch(() => {
  return (
    <div className='relative flex w-full items-center gap-3 rounded-lg border border-[#496C72] bg-[#1A2B2F] px-4 py-3 sm:gap-6'>
      <div className='hidden items-center gap-2 rounded-md bg-[#396C6D] px-2.5 py-0.5 md:flex'>
        <span className='bg-ic-blue-400 h-2 w-2 rounded-full' />
        <p className='text-ic-blue-100 text-xs'>Live now</p>
      </div>
      <p className='text-ic-blue-100 text-xs font-semibold'>
        IC Leverage Trading Raffle
      </p>
      <p className='text-ic-gray-400 hidden text-xs sm:block'>
        Win 25,000 INDEX every 14 days
      </p>
      <Button
        className='ml-auto shrink-0 whitespace-nowrap rounded-full bg-teal-100 px-5 py-1 text-xs transition-colors duration-500 hover:bg-teal-200'
        as='a'
        target='_blank'
        href='https://indexcoop.com/blog/trading-raffle'
      >
        Learn more
      </Button>
    </div>
  )
})
