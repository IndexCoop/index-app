'use client'

import { Swap } from '@/components/swap'
import { useSelectedToken } from '@/lib/providers/selected-token-provider'

export default function SwapPage() {
  const { inputToken, isMinting, outputToken } = useSelectedToken()
  return (
    <div className='mx-auto flex h-full flex-col lg:flex-row'>
      <div className='mb-4 mr-1 flex w-full max-w-lg flex-col gap-8 lg:mb-3'>
        <Swap
          isBuying={isMinting}
          inputToken={inputToken}
          outputToken={outputToken}
        />
      </div>
    </div>
  )
}
