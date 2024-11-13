import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'

import { PeriodSelector } from '@/components/charts/period-selector'
import PriceXYChart from '@/components/charts/price-xy-chart'
import { useChartData } from '@/components/charts/use-chart-data'
import { MAINNET } from '@/constants/chains'
import { Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/use-network'
import { formatDollarAmount } from '@/lib/utils'
import { cn } from '@/lib/utils/tailwind'

type Props = {
  indexToken: Token
  isFetchingStats?: boolean
  nav: number | null
}

export function PriceChart({ indexToken, isFetchingStats, nav }: Props) {
  const { chainId } = useNetwork()
  const tokenAddress = getTokenByChainAndSymbol(
    chainId ?? MAINNET.chainId,
    indexToken.symbol,
  )?.address
  const { historicalData, selectedPeriod, setSelectedPeriod } = useChartData(
    tokenAddress,
    'nav',
  )

  return (
    <div className='border-ic-gray-200 dark:border-ic-gray-600 flex h-full w-full flex-col rounded-3xl border bg-[#F7F8F8] dark:bg-[#1C2C2E]'>
      <div className='text-ic-gray-800 dark:text-ic-white flex w-full items-stretch px-4 pt-4 md:px-8 md:pt-6'>
        <div
          className={cn(
            'basis-1/2 self-center text-lg font-semibold md:basis-1/4 md:text-2xl',
            nav === null &&
              isFetchingStats &&
              'bg-ic-gray-200 h-[18px] animate-pulse rounded-md text-opacity-0 md:h-8',
          )}
        >
          {formatDollarAmount(nav, true)}
        </div>
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div>
      <div className='block h-full w-full dark:hidden'>
        <PriceXYChart data={historicalData} selectedPeriod={selectedPeriod} />
      </div>
      <div className='hidden h-full w-full dark:block'>
        <PriceXYChart
          data={historicalData}
          selectedPeriod={selectedPeriod}
          isDark={true}
        />
      </div>
    </div>
  )
}
