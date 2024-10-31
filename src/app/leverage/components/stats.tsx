import clsx from 'clsx'

import { TokenDisplay } from '@/app/leverage/components/leverage-widget/components/token-display'
import { formatPercentage } from '@/app/products/utils/formatters'
import { Token } from '@/constants/tokens'
import { formatDollarAmount } from '@/lib/utils'

import { useLeverageToken } from '../provider'
import { useFormattedLeverageData } from '../use-formatted-data'

export function Stats() {
  const { baseToken, indexToken, nav, navchange, stats } = useLeverageToken()
  const { price, change24h, change24hIsPositive, low24h, high24h } =
    useFormattedLeverageData(stats)
  return (
    <div className='border-ic-gray-600 flex w-full flex-row items-center justify-between rounded-3xl border bg-[#1C2C2E] px-0 sm:px-4'>
      <StatsItem
        token={baseToken}
        change24h={change24h}
        change24hIsPositive={change24hIsPositive}
        high24h={high24h}
        low24h={low24h}
        price={price}
      />
      <div className='bg-ic-gray-800 h-full w-[1px]' />
      <StatsItem
        token={indexToken}
        change24h={navchange !== 0 ? formatPercentage(navchange) : ''}
        change24hIsPositive={navchange > 0}
        high24h={high24h}
        low24h={low24h}
        price={nav > 0 ? formatDollarAmount(nav) : ''}
      />
    </div>
  )
}

type StatsItemProps = {
  token: Token
  price: string
  change24h: string
  change24hIsPositive: boolean
  high24h: string
  low24h: string
}

function StatsItem(props: StatsItemProps) {
  const { change24h, change24hIsPositive, price, token } = props
  const iconColor = change24hIsPositive ? 'fill-ic-green' : 'fill-ic-red'
  const iconScale = change24hIsPositive ? '' : '-scale-100'
  const textColor = change24hIsPositive ? 'text-[#65D993]' : 'text-ic-red'
  return (
    <div className='flex flex-grow flex-row items-center justify-center gap-2 py-2 sm:py-3 md:gap-6 md:py-6'>
      <div className='flex'>
        <TokenDisplay token={token} />
      </div>
      <div className='text-ic-white ml-0 text-sm font-semibold sm:text-xl'>
        {price}
      </div>
      <div className='hidden flex-col gap-1 sm:flex md:hidden lg:flex'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h Change</div>
        {change24h.length > 0 ? (
          <div className='flex flex-row items-center gap-1'>
            <div>
              <svg
                className={clsx(iconColor, iconScale)}
                xmlns='http://www.w3.org/2000/svg'
                width='8'
                height='6'
                viewBox='0 0 8 6'
                fill='none'
              >
                <path d='M0.666667 5.86914L4 2.26083L7.33333 5.86914L8 5.14748L4 0.817505L6.24448e-08 5.14748L0.666667 5.86914Z' />
              </svg>
            </div>
            <div className={clsx('text-base font-semibold', textColor)}>
              {change24h}
            </div>
          </div>
        ) : (
          <div className={clsx('text-base font-semibold', textColor)}>n/a</div>
        )}
      </div>
      {/* <div className='hidden flex-col gap-1 sm:flex md:hidden lg:flex'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h High</div>
        <div className='text-ic-white text-base font-semibold'>{high24h}</div>
      </div>
      <div className='hidden flex-col gap-1 sm:flex md:hidden lg:flex'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h Low</div>
        <div className='text-ic-white text-base font-semibold'>{low24h}</div>
      </div> */}
    </div>
  )
}
