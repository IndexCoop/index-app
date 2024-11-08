type Props = {
  line1: string
  line2: string
}

export function ChartTooltip({ line1, line2 }: Props) {
  return (
    <div>
      <div className='text-ic-gray-800 dark:text-ic-white mb-1 text-[14px] font-bold'>
        {line1}
      </div>
      <div className='text-ic-gray-700 dark:text-ic-gray-300 text-xs font-light'>
        {line2}
      </div>
    </div>
  )
}
