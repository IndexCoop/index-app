import { cn } from '@/lib/utils/tailwind'

type Props = {
  className?: string
  isLoading: boolean
  label?: string
  value: string
  overrideValueClassName?: string
}

export function StatsMetric({
  className,
  isLoading,
  label,
  overrideValueClassName,
  value,
}: Props) {
  return (
    <div className={cn('flex-col gap-1', className)}>
      {label && <div className='text-ic-gray-300 text-xs'>{label}</div>}
      <div
        className={cn(
          'text-ic-gray-50 h-5 w-full text-sm font-medium',
          isLoading && 'bg-ic-gray-800 animate-pulse rounded-md text-opacity-0',
          overrideValueClassName,
        )}
      >
        {value}
      </div>
    </div>
  )
}
