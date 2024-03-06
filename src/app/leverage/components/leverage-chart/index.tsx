'use client'

import { useRef } from 'react'

// import { useSize } from '@chakra-ui/react-use-size'

// TODO: build actual chart component
// import Chart from './components/chart'
import { DateRange } from './components/date-range'
import { Price } from './components/price'
import { RangeSelection } from './components/range-selection'

export function LeverageChart() {
  const elementRef = useRef<HTMLDivElement>(null)
  // const { width } = useSize(elementRef) ?? { width: null }
  return (
    <div
      className='border-ic-gray-600 flex w-full max-w-3xl flex-col rounded-3xl border bg-[#1C2C2E]'
      ref={elementRef}
    >
      <div className='flex w-full flex-row items-center justify-between gap-2 px-8 pb-0 pt-8'>
        <Price label={'$2,379.95'} />
        <RangeSelection />
      </div>
      <div className='mx-0 my-5 h-60'>
        {/* <Chart width={width ?? 768} height={240 - 20} /> */}
      </div>
      <div className='mb-4'>
        <DateRange />
      </div>
    </div>
  )
}
