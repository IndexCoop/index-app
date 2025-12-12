import { LeverageType } from '@/app/trade/types'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { cn } from '@/lib/utils/tailwind'

type LeverageSelectorProps = {
  selectedType: LeverageType
  supportedTypes: LeverageType[]
  onSelectType: (type: LeverageType) => void
}

export function LeverageSelector(props: LeverageSelectorProps) {
  const { onSelectType, selectedType, supportedTypes } = props
  const { logEvent } = useAnalytics()

  const handleClick = (leverageType: LeverageType) => {
    logEvent('Leverage Ratio Selected', {
      context: 'button',
      strategy: getLabelForLeverageType(leverageType),
    })
    onSelectType(leverageType)
  }

  return (
    <div className='flex flex-row items-center justify-between rounded-lg border border-[#3A6060] p-4 dark:border-neutral-700'>
      <div className='text-xs font-medium text-neutral-400'>Leverage</div>
      <div className='flex flex-row gap-2'>
        {supportedTypes?.length > 0 &&
          supportedTypes.map((leverageType) => {
            const label = getLabelForLeverageType(leverageType)
            return (
              <LeverageSelectorButton
                key={`leverage-type-${label}`}
                isSelected={selectedType === leverageType}
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

function LeverageSelectorButton({
  isSelected,
  label,
  onClick,
}: LeverageSelectorButtonProps) {
  return (
    <div
      className={cn(
        'w-14 cursor-pointer rounded-full border bg-zinc-800 px-3 py-2 text-center text-sm font-semibold text-neutral-400 transition duration-150',
        isSelected
          ? 'border-ic-blue-300 text-ic-white bg-zinc-700'
          : 'hover:text-ic-white border-zinc-900',
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
