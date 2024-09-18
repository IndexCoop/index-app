import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'

import { ChartPeriod } from '@/components/charts/types'

const periods = [
  ChartPeriod.Hour,
  ChartPeriod.Day,
  ChartPeriod.Week,
  ChartPeriod.Month,
  ChartPeriod.Year,
]

type Props = {
  selectedPeriod: ChartPeriod
  setSelectedPeriod: Dispatch<SetStateAction<ChartPeriod>>
}

export function PeriodSelector({ selectedPeriod, setSelectedPeriod }: Props) {
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
