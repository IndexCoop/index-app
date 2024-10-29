import { useLeverageToken } from '@/app/(dark)/leverage/provider'
import { PeriodSelector } from '@/components/charts/period-selector'
import PriceXYChart from '@/components/charts/price-xy-chart'
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
  const { historicalData, selectedPeriod, setSelectedPeriod } =
    useChartData(tokenAddress)
  const { nav } = useLeverageToken()

  return (
    <div className='border-ic-gray-600 flex h-full w-full flex-col rounded-3xl border bg-[#1C2C2E]'>
      <div className='text-ic-white flex w-full flex-wrap items-stretch px-8 pt-6'>
        <div className='basis-1/2 text-2xl font-semibold md:basis-1/4'>
          {nav > 0 ? formatDollarAmount(nav) : ''}
        </div>
        <div className='my-auto basis-1/2 text-center text-2xl font-medium md:basis-1/4'>
          {indexToken.symbol}
        </div>
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div>
      <div className='h-full w-full'>
        <PriceXYChart data={historicalData} selectedPeriod={selectedPeriod} />
      </div>
    </div>
  )
}
