import { ChevronDownIcon } from '@heroicons/react/20/solid'

type LeverageSelectorProps = {
  leverage: string
  leverageType: string
  onClick: () => void
}

export function LeverageSelector({
  leverage,
  leverageType,
  onClick,
}: LeverageSelectorProps) {
  return (
    <div className='flex flex-col gap-0.5 py-2'>
      <div
        className='flex cursor-pointer flex-row items-center gap-1 text-sm'
        onClick={onClick}
      >
        <span className='text-ic-blue-300 font-bold'>{leverage}</span>
        <span className='text-ic-gray-100 font-bold'>{leverageType}</span>
        <ChevronDownIcon className='dark:text-ic-white text-ic-black size-4' />
      </div>
      <div className='text-ic-gray-300 flex items-center gap-1.5 text-xs font-normal'>
        <span>Current Leverage</span>
        <span className='bg-ic-blue-300 text-ic-gray-950 rounded px-1.5 py-px text-[9px] font-semibold'>
          {'1.94%'}
        </span>
      </div>
    </div>
  )
}
