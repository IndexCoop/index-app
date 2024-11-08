import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'

import { formatTvl } from '@/app/products/utils/formatters'
import { PeriodSelector } from '@/components/charts/period-selector'
import TvlXyChart from '@/components/charts/tvl-xy-chart'
import { useChartData } from '@/components/charts/use-chart-data'
import { MAINNET } from '@/constants/chains'
import { Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/use-network'

type Props = {
  indexToken: Token
  tvl: number | null
}

export function TvlChart({ indexToken, tvl }: Props) {
  const { chainId } = useNetwork()
  const tokenAddress = getTokenByChainAndSymbol(
    chainId ?? MAINNET.chainId,
    indexToken.symbol,
  )?.address
  const { historicalData, selectedPeriod, setSelectedPeriod } = useChartData(
    tokenAddress,
    'pav',
  )

  return (
    <div className='border-ic-gray-200 dark:border-ic-gray-600 flex h-full w-full flex-col rounded-3xl border bg-[#F7F8F8] dark:bg-[#1C2C2E]'>
      <div className='text-ic-gray-800 dark:text-ic-white flex w-full items-stretch px-4 pt-4 md:px-8 md:pt-6'>
        <div className='basis-1/2 self-center text-lg font-semibold md:basis-1/4 md:text-2xl'>
          {formatTvl(tvl)}
        </div>
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div>
      <div className='block h-full w-full dark:hidden'>
        <TvlXyChart data={historicalData} selectedPeriod={selectedPeriod} />
      </div>
      <div className='hidden h-full w-full dark:block'>
        <TvlXyChart
          data={historicalData}
          selectedPeriod={selectedPeriod}
          isDark={true}
        />
      </div>
    </div>
  )
}
