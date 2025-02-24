import clsx from 'clsx'

import { LeverageType } from '@/app/leverage/types'
import { useAnalytics } from '@/lib/hooks/use-analytics'

type LeverageSelectorProps = {
  selectedTye: LeverageType
  supportedTypes: LeverageType[]
  onSelectType: (type: LeverageType) => void
}

export function LeverageSelector(props: LeverageSelectorProps) {
  const { onSelectType, selectedTye, supportedTypes } = props
  const { logEvent } = useAnalytics()

  const handleClick = (leverageType: LeverageType) => {
    logEvent('Leverage Ratio Selected', {
      context: 'button',
      strategy: getLabelForLeverageType(leverageType),
    })
    onSelectType(leverageType)
  }

  return (
    <div className='dark:border-ic-gray-700 flex flex-row items-center justify-between rounded-lg border border-[#3A6060] p-4'>
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
                onClick={() => handleClick(leverageType)}
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
  return (
    <div
      className={clsx(
        'text-ic-gray-300 bg-ic-gray-975 w-14 cursor-pointer rounded-full border px-3 py-2 text-center text-sm font-bold transition duration-150',
        isSelected
          ? 'border-ic-blue-600'
          : 'border-ic-gray-975 hover:text-ic-blue-300',
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
