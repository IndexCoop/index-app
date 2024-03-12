import clsx from 'clsx'

import { LeverageType } from '@/app/leverage/provider'

export function LeverageSelector(props: { selectedTye: LeverageType }) {
  const { selectedTye } = props
  return (
    <div className='flex flex-row items-center justify-between rounded-xl border border-[#3A6060] p-4'>
      <div className='text-ic-gray-300 text-xs font-medium'>Leverage</div>
      <div className='flex flex-row gap-2'>
        <LeverageSelectorButton
          isSelected={selectedTye === LeverageType.Short}
          label='-1x'
        />
        <LeverageSelectorButton
          isSelected={selectedTye === LeverageType.Long2x}
          label='2x'
        />
        <LeverageSelectorButton
          isSelected={selectedTye === LeverageType.Long3x}
          label='3x'
        />
      </div>
    </div>
  )
}

type LeverageSelectorButtonProps = {
  isSelected: boolean
  label: string
}

export function LeverageSelectorButton({
  isSelected,
  label,
}: LeverageSelectorButtonProps) {
  const border = isSelected ? 'border-[1px]' : 'border-0'
  return (
    <div
      className={clsx(
        'text-ic-gray-300 bg-ic-blue-950 border-ic-blue-600 w-14 cursor-pointer rounded-full px-3 py-2 text-center text-sm font-bold',
        border,
      )}
    >
      {label}
    </div>
  )
}
