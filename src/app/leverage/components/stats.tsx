export function Stats() {
  return (
    <div className='border-ic-gray-600 flex flex-row items-center gap-10 rounded-3xl border bg-[#1C2C2E] px-8 py-6'>
      <div className='flex'>
        <div className='text-ic-gray-50 text-xl font-bold'>ETH / USD</div>
      </div>
      <div className='text-ic-white text-xl font-semibold'>$2,194.49</div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h Change</div>
        <div className='text-ic-green text-base font-semibold'>6.29%</div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h High</div>
        <div className='text-ic-white text-base font-semibold'>2,348.22</div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-ic-gray-100 text-xs font-normal'>24h Low</div>
        <div className='text-ic-white text-base font-semibold'>2,165.95</div>
      </div>
    </div>
  )
}
