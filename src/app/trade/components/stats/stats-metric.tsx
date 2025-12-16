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
      {label && (
        <div className='mb-1 text-left text-xs leading-[14px] text-neutral-400'>
          {label}
        </div>
      )}
      <div
        className={cn(
          'text-ic-white w-full text-sm font-medium',
          isLoading && 'animate-pulse rounded-md bg-zinc-800 text-opacity-0',
          overrideValueClassName,
        )}
      >
        {value}
      </div>
    </div>
  )
}
