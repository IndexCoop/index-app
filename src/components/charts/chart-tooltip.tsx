import { cn } from '@/lib/utils/tailwind'

type Props = {
  isDark: boolean
  line1: string
  line2: string
}

export function ChartTooltip({ isDark, line1, line2 }: Props) {
  return (
    <div>
      <div
        className={cn(
          'text-ic-gray-800 mb-1 text-[14px] font-bold',
          isDark && 'text-ic-white',
        )}
      >
        {line1}
      </div>
      <div
        className={cn(
          'text-ic-gray-700 text-xs font-light',
          isDark && 'text-ic-gray-300',
        )}
      >
        {line2}
      </div>
    </div>
  )
}
