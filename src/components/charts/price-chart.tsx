import { PeriodSelector } from '@/components/charts/period-selector'
import { ChartPeriod } from '@/components/charts/types'
import { Token } from '@/constants/tokens'

type Props = {
  indexToken: Token
}

const periods = [
  ChartPeriod.Hour,
  ChartPeriod.Day,
  ChartPeriod.Week,
  ChartPeriod.Month,
  ChartPeriod.Year,
  ChartPeriod.All,
]

export function PriceChart({ indexToken }: Props) {
  return (
    <div className='border-ic-gray-600 flex h-full w-full flex-col rounded-3xl border bg-[#1C2C2E]'>
      <div className='text-ic-white flex w-full items-stretch px-8 py-6'>
        <div className='basis-1/4 text-2xl font-semibold'>$2,225.11</div>
        <div className='my-auto basis-1/4 text-center text-sm font-medium'>
          {indexToken.symbol}
        </div>
        <PeriodSelector periods={periods} />
      </div>
      <div className='flex'>{indexToken.symbol}</div>
    </div>
  )
}
