import { cn } from '@/lib/utils/tailwind'

type Props = {
  className?: string
  isLoading: boolean
  label: string
  value: string
  overrideLabelColor?: string
}

export function StatsMetric({
  className,
  isLoading,
  label,
  overrideLabelColor,
  value,
}: Props) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className='text-ic-gray-300 text-xs'>{label}</div>
      <div
        className={cn(
          'text-ic-gray-100 h-6 text-sm font-medium',
          isLoading && 'bg-ic-gray-700 animate-pulse rounded-md text-opacity-0',
          overrideLabelColor,
        )}
      >
        {value}
      </div>
    </div>
  )
}
