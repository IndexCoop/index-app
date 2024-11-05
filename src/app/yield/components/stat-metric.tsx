import { cn } from '@/lib/utils/tailwind'

type Props = {
  className?: string
  label: string
  value: string
}

export function StatMetric({ className, label, value }: Props) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className='text-ic-gray-500 text-sm'>{label}</div>
      <div className='text-ic-gray-700 font-semibold'>{value}</div>
    </div>
  )
}
