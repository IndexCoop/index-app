import { Button } from '@headlessui/react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils/tailwind'

import type { FC } from 'react'

type DepositWithdrawProps = {
  isMinting: boolean
  isMintingDisabled?: boolean
  toggleIsMinting: () => void
}

export const DepositWithdraw: FC<DepositWithdrawProps> = ({
  isMinting,
  isMintingDisabled,
  toggleIsMinting,
}) => {
  return (
    <div className='relative flex h-11 w-full justify-around rounded-full bg-zinc-800 text-sm text-neutral-400'>
      <motion.div
        animate={{
          translateX: isMinting ? '0%' : '100%',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='pointer-events-none absolute left-0 top-0 h-full w-1/2 rounded-full bg-neutral-50 [isolation:isolate]'
      />
      <Button
        className={cn(
          'relative z-10 h-11 w-full transition-all duration-500',
          isMinting && 'text-zinc-800',
          isMintingDisabled && 'cursor-not-allowed',
        )}
        disabled={isMintingDisabled}
        onClick={toggleIsMinting}
      >
        Deposit
      </Button>
      <Button
        className={cn(
          'relative z-10 h-11 w-full transition-all duration-500',
          !isMinting && 'text-zinc-800',
        )}
        onClick={toggleIsMinting}
      >
        Withdraw
      </Button>
    </div>
  )
}
