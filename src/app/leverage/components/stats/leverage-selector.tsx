import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { LeverageStrategy } from '@/app/leverage/types'
import { cn } from '@/lib/utils/tailwind'

type Props = {
  leverage: string
  leverageType: string
  ratio: string
}

export function LeverageSelector({ leverage, leverageType, ratio }: Props) {
  return (
    <div className='flex flex-col gap-0.5 py-2'>
      <div className='flex cursor-pointer flex-row items-center gap-1 text-sm'>
        <span
          className={cn(
            'font-bold',
            leverage === LeverageStrategy.Short1x
              ? 'text-[#EF7C78]'
              : 'text-ic-blue-300',
          )}
        >
          {leverage}
        </span>
        <span className='text-ic-gray-100 font-bold'>{leverageType}</span>
        <ChevronDownIcon className='dark:text-ic-white text-ic-black size-4' />
      </div>
      <div className='text-ic-gray-300 flex items-center gap-1.5 text-xs font-normal'>
        <span className='xs:flex hidden'>Current</span> Leverage
        <span
          className={cn(
            'bg-ic-blue-300 text-ic-gray-950 rounded px-1.5 py-px text-[9px] font-semibold',
            leverage === LeverageStrategy.Short1x
              ? 'bg-[#EF7C78]'
              : 'bg-ic-blue-300',
          )}
        >
          {ratio}
        </span>
      </div>
    </div>
  )
}
