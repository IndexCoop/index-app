import { BaseTokenStats } from '@/app/leverage/provider'

type StatsProps = {
  data: BaseTokenStats
}

export function Stats(props: StatsProps) {
  const { data } = props
  return (
    <div className='border-ic-gray-600 flex flex-row items-center gap-10 rounded-3xl border bg-[#1C2C2E] px-8 py-6'>
      <div className='flex'>
        <div className='text-ic-gray-50 text-xl font-bold'>
          {data.symbol} / USD
        </div>
      </div>
      <div className='text-ic-white text-xl font-semibold'>{`$${data.price}`}</div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h Change</div>
        <div className='text-ic-green text-base font-semibold'>{`${data.change24h}%`}</div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h High</div>
        <div className='text-ic-white text-base font-semibold'>{`${data.high24h}`}</div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h Low</div>
        <div className='text-ic-white text-base font-semibold'>{`${data.low24h}`}</div>
      </div>
    </div>
  )
}
