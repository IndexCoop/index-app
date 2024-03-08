import { useLeverageToken } from '../provider'
import { useFormattedLeverageData } from '../use-formatted-data'

export function Stats() {
  const { stats } = useLeverageToken()
  const { symbol, price, change24h, low24h, high24h } =
    useFormattedLeverageData(stats)
  return (
    <div className='border-ic-gray-600 flex flex-row items-center gap-10 rounded-3xl border bg-[#1C2C2E] px-8 py-6'>
      <div className='flex'>
        <div className='text-ic-gray-50 text-xl font-bold'>{symbol} / USD</div>
      </div>
      <div className='text-ic-white text-xl font-semibold'>{price}</div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h Change</div>
        <div className='text-ic-green text-base font-semibold'>{change24h}</div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h High</div>
        <div className='text-ic-white text-base font-semibold'>{high24h}</div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h Low</div>
        <div className='text-ic-white text-base font-semibold'>{low24h}</div>
      </div>
    </div>
  )
}
