import { ChevronDownIcon } from '@heroicons/react/20/solid'

type LeverageSelectorProps = {
  leverage: string
  leverageType: string
  onClick: () => void
}

export function LeverageSelector(props: LeverageSelectorProps) {
  const { leverage, leverageType } = props
  return (
    <div
      className='flex cursor-pointer flex-row items-center gap-1 py-2 text-sm'
      onClick={props.onClick}
    >
      <span className='text-ic-blue-300 font-bold'>{leverage}</span>
      <span className='text-ic-gray-100 font-bold'>{leverageType}</span>
      <ChevronDownIcon className='dark:text-ic-white text-ic-black size-4' />
    </div>
  )
}
