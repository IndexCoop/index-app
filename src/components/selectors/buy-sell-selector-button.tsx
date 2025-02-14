import { cn } from '@/lib/utils/tailwind'

type Props = {
  isSelected: boolean
  label: string
  roundedLeft: boolean
  onClick: () => void
}

export function BuySellSelectorButton({
  isSelected,
  label,
  roundedLeft,
  onClick,
}: Props) {
  return (
    <div
      className={cn(
        'dark:bg-ic-gray-975 flex-grow cursor-pointer select-none rounded-md',
        isSelected && 'bg-[#F0FEFF]',
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'py-4 text-center text-sm font-medium',
          isSelected
            ? 'text-ic-gray-700 dark:text-ic-white'
            : 'text-ic-gray-500',
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          'h-1 w-full',
          isSelected
            ? 'dark:bg-ic-blue-600 bg-[#A5D6D6]'
            : 'bg-ic-gray-100 dark:bg-ic-gray-800',
          roundedLeft ? 'rounded-bl-md' : 'rounded-br-md',
        )}
      />
    </div>
  )
}
