import { cn } from '@/lib/utils/tailwind'

type Props = {
  className?: string
  isLoading: boolean
  label: string
  value: string
}

export function StatsMetric({ className, isLoading, label, value }: Props) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className='text-ic-gray-500 text-xs'>{label}</div>
      <div
        className={cn(
          'text-ic-gray-700 h-6 text-sm font-semibold',
          isLoading && 'bg-ic-gray-200 animate-pulse rounded-md text-opacity-0',
        )}
      >
        {value}
      </div>
    </div>
  )
}
