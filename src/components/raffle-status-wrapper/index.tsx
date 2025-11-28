'use client'

import { useAppKit } from '@reown/appkit/react'
import { ReactNode } from 'react'

import { useWallet } from '@/lib/hooks/use-wallet'

type RaffleStatusWrapperProps = {
  children: ReactNode
}

export function RaffleStatusWrapper({ children }: RaffleStatusWrapperProps) {
  const { address } = useWallet()
  const { open } = useAppKit()

  if (!address) {
    return (
      <div className='border-ic-gray-500 bg-ic-black flex w-full flex-col gap-4 self-stretch rounded-lg border p-6'>
        <h2 className='text-ic-gray-50 text-sm font-bold'>
          Your raffle status
        </h2>

        <p className='text-ic-gray-400 text-sm'>
          Connect a wallet to see your tickets, rank, and claim status.
        </p>

        <button
          onClick={() => open()}
          className='bg-ic-blue-300 hover:bg-ic-blue-400 w-fit rounded-full px-6 py-3 text-sm font-semibold text-black transition'
        >
          Connect wallet
        </button>
      </div>
    )
  }

  return <div className='flex w-full flex-col gap-4'>{children}</div>
}
