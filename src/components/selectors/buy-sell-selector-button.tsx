import { useAnalytics } from '@/lib/hooks/use-analytics'
import { cn } from '@/lib/utils/tailwind'

type Props = {
  isSelected: boolean
  label: string
  roundedLeft: boolean
  onClick: () => void
}

export function BuySellSelectorButton({ isSelected, label, onClick }: Props) {
  const { logEvent } = useAnalytics()
  const handleClick = () => {
    logEvent('Open/Close Selector Clicked', {
      label,
    })
    onClick()
  }
  return (
    <div
      className={cn(
        'group flex-grow cursor-pointer select-none rounded-full transition duration-150 dark:bg-zinc-800',
        isSelected && 'bg-[#F0FEFF] dark:bg-zinc-700',
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          'py-3 text-center text-sm font-medium',
          isSelected
            ? 'text-ic-gray-700 dark:text-ic-white'
            : 'text-ic-gray-500 dark:text-neutral-400',
        )}
      >
        {label}
      </div>
    </div>
  )
}
