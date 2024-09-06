import clsx from 'clsx'
import { useState } from 'react'

import { ChartPeriod } from '@/components/charts/types'

type Props = {
  periods: ChartPeriod[]
}

export function PeriodSelector({ periods }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState(ChartPeriod.Day)
  return (
    <div className='ml-auto flex space-x-2 text-sm font-medium'>
      {periods.map((period) => (
        <div
          key={period}
          className={clsx(
            'text-ic-gray-50 flex size-9 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold',
            selectedPeriod === period && 'bg-ic-gray-200 !text-ic-gray-950',
          )}
          onClick={() => setSelectedPeriod(period)}
        >
          {period}
        </div>
      ))}
    </div>
  )
}
