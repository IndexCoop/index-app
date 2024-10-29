import { useLeverageToken } from '@/app/leverage/provider'
import { PeriodSelector } from '@/components/charts/period-selector'
import PriceXYChart from '@/components/charts/price-xy-chart'
import { usePriceChartData } from '@/components/charts/use-price-chart-data'
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
    usePriceChartData(tokenAddress)
  const { nav } = useLeverageToken()

  return (
    <div className='border-ic-gray-600 flex h-full w-full flex-col rounded-3xl border bg-[#1C2C2E]'>
      <div className='text-ic-white flex w-full items-stretch px-4 pt-4 md:px-8 md:pt-6'>
        <div className='basis-1/2 self-center text-lg font-semibold md:basis-1/4 md:text-2xl'>
          {nav > 0 ? formatDollarAmount(nav) : ''}
        </div>
        <div className='my-auto hidden text-center text-2xl font-medium md:flex'>
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
