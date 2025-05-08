import Link from 'next/link'

import { cn } from '@/lib/utils/tailwind'

export function WstEthBanner() {
  return (
    <div
      className={cn(
        'xs:flex-row mx-4 flex flex-col items-center gap-4 rounded-lg bg-gradient-to-r from-[#3C6073] to-[#1D2041] p-4',
      )}
    >
      <div className='flex flex-col items-center'>
        <p className='text-ic-white text-xs font-normal'>
          Due to new borrowing being disabled on Aave V2,{' '}
          <span className='underline'>
            this product no longer accepts new deposits.
          </span>
          <span className='hidden sm:inline'>
            <br />
          </span>
          Try our next-gen Smart Loop, wstETH15x: All the benefits of icETH with
          up to 15x leverage.
        </p>
      </div>
      <Link
        className='text-ic-black bg-ic-white whitespace-nowrap rounded-3xl px-6 py-2 text-xs font-semibold'
        href={
          '/earn/product/0xc8DF827157AdAf693FCb0c6f305610C28De739FD?buy=wstETH15x&sell=ETH&network=8453'
        }
      >
        Explore wstETH15x
      </Link>
    </div>
  )
}
