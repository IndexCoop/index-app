import LineChart from '@/components/charts/line-chart'
import { PeriodSelector } from '@/components/charts/period-selector'
import { useChartData } from '@/components/charts/use-chart-data'
import { ARBITRUM } from '@/constants/chains'
import { Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/use-network'
import { formatDollarAmount } from '@/lib/utils'
import { getAddressForToken } from '@/lib/utils/tokens'

type Props = {
  indexToken: Token
}

export function PriceChart({ indexToken }: Props) {
  const { chainId } = useNetwork()
  const tokenAddress = getAddressForToken(
    indexToken,
    chainId ?? ARBITRUM.chainId,
  )
  const { historicalData, nav, selectedPeriod, setSelectedPeriod } =
    useChartData(tokenAddress)

  return (
    <div className='border-ic-gray-600 flex h-full w-full flex-col rounded-3xl border bg-[#1C2C2E]'>
      <div className='text-ic-white flex w-full items-stretch px-8 py-6'>
        <div className='basis-1/4 text-2xl font-semibold'>
          {nav > 0 ? formatDollarAmount(nav) : ''}
        </div>
        <div className='my-auto basis-1/4 text-center text-sm font-medium'>
          {indexToken.symbol}
        </div>
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div>
      <div className='h-full w-full px-4'>
        <LineChart data={historicalData} selectedPeriod={selectedPeriod} />
      </div>
    </div>
  )
}
