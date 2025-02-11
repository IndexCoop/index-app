import { ChevronDownIcon } from '@heroicons/react/20/solid'

type LeverageSelectorProps = {
  leverage: string
  leverageType: string
  onClick: () => void
}

type CurrentLeverageProps = {
  leverage: string
}

function CurrentLeverage(props: CurrentLeverageProps) {
  return (
    <div className='text-ic-gray-300 flex items-center gap-1 text-xs font-normal'>
      <span>Current Leverage</span>
      <span className='bg-ic-blue-300 text-ic-gray-950 rounded px-1.5 py-px text-[9px] font-semibold'>
        {props.leverage}
      </span>
    </div>
  )
}

export function LeverageSelector(props: LeverageSelectorProps) {
  const { leverage, leverageType } = props
  return (
    <div className='flex-col gap-1 py-2'>
      <div
        className='flex cursor-pointer flex-row items-center gap-1 text-sm'
        onClick={props.onClick}
      >
        <span className='text-ic-blue-300 font-bold'>{leverage}</span>
        <span className='text-ic-gray-100 font-bold'>{leverageType}</span>
        <ChevronDownIcon className='dark:text-ic-white text-ic-black size-4' />
      </div>
      <CurrentLeverage leverage={'1.94x'} />
    </div>
  )
}
