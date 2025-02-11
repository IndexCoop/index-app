import { useMemo } from 'react'

import { PeriodSelector } from '@/components/charts/period-selector'
import PriceXYChart from '@/components/charts/price-xy-chart'
import { useChartData } from '@/components/charts/use-chart-data'
import { TokenDisplay } from '@/components/token-display'
import { Token } from '@/constants/tokens'
import { formatDollarAmount } from '@/lib/utils'
import { cn } from '@/lib/utils/tailwind'
import { digitsByAddress } from '@/lib/utils/tokens'

type Props = {
  indexToken?: Token
  indexTokenAddress: string
  isFetchingStats?: boolean
  nav: number | null
}

// Branch created for data support
export function PriceChart({
  indexToken,
  indexTokenAddress,
  isFetchingStats,
  nav,
}: Props) {
  const { historicalData, selectedPeriod, setSelectedPeriod } = useChartData(
    indexTokenAddress,
    'nav',
  )

  const digits = useMemo(
    () => digitsByAddress(indexTokenAddress),
    [indexTokenAddress],
  )

  return (
    <div className='border-ic-gray-200 dark:border-ic-gray-600 flex h-full w-full flex-col rounded-lg border bg-[#F7F8F8] dark:bg-[#1C2C2E]'>
      <div className='text-ic-gray-800 dark:text-ic-white flex w-full items-stretch px-4 pt-4 md:px-8 md:pt-6'>
        <div
          className={cn(
            'flex items-center self-center text-lg font-semibold sm:text-xl',
            nav === null &&
              isFetchingStats &&
              'bg-ic-gray-200 h-[18px] animate-pulse rounded-md text-opacity-0 md:h-8',
          )}
        >
          {indexToken && (
            <TokenDisplay className='mr-4 hidden sm:flex' token={indexToken} />
          )}
          {formatDollarAmount(nav, true, digits)}
        </div>
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div>
      <div className='block h-full w-full dark:hidden'>
        <PriceXYChart
          data={historicalData}
          selectedPeriod={selectedPeriod}
          digits={digits}
        />
      </div>
      <div className='hidden h-full w-full dark:block'>
        <PriceXYChart
          data={historicalData}
          digits={digits}
          selectedPeriod={selectedPeriod}
          isDark={true}
        />
      </div>
    </div>
  )
}
