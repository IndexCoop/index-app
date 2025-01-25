import clsx from 'clsx'

import { LeverageType } from '@/app/leverage/types'

type LeverageSelectorProps = {
  selectedTye: LeverageType
  supportedTypes: LeverageType[]
  onSelectType: (type: LeverageType) => void
}

export function LeverageSelector(props: LeverageSelectorProps) {
  const { onSelectType, selectedTye, supportedTypes } = props
  return (
    <div className='flex flex-row items-center justify-between rounded-xl border border-[#3A6060] p-4'>
      <div className='text-ic-gray-300 text-xs font-medium'>Leverage</div>
      <div className='flex flex-row gap-2'>
        {supportedTypes?.length > 0 &&
          supportedTypes.map((leverageType) => {
            const label = getLabelForLeverageType(leverageType)
            return (
              <LeverageSelectorButton
                key={`leverage-type-${label}`}
                isSelected={selectedTye === leverageType}
                label={label}
                onClick={() => onSelectType(leverageType)}
              />
            )
          })}
      </div>
    </div>
  )
}

type LeverageSelectorButtonProps = {
  isSelected: boolean
  label: string
  onClick: () => void
}

export function LeverageSelectorButton({
  isSelected,
  label,
  onClick,
}: LeverageSelectorButtonProps) {
  const border = isSelected ? 'border-[1px]' : 'border-0'
  return (
    <div
      className={clsx(
        'text-ic-gray-300 bg-ic-blue-950 border-ic-blue-600 w-14 cursor-pointer rounded-full px-3 py-2 text-center text-sm font-bold',
        border,
      )}
      onClick={onClick}
    >
      {label}
    </div>
  )
}

export function getLabelForLeverageType(type: LeverageType): string {
  switch (type) {
    case LeverageType.Long2x:
      return '2x'
    case LeverageType.Long3x:
      return '3x'
    case LeverageType.Short:
      return '-1x'
  }
}
