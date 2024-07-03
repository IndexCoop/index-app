export function StakedPanel() {
  return (
    <div className='bg-ic-gray-50 border-ic-gray-300 my-3 rounded-xl border'>
      <div className='divide-ic-gray-300 flex w-full divide-x text-sm'>
        <div className='text-ic-gray-600 w-1/2 px-3 py-5'>
          <div className='mb-2'>Total PRTs Staked</div>
          <div className='font-semibold'>967</div>
        </div>
        <div className='text-ic-gray-600 w-1/2 px-3 py-5'>
          <div className='mb-2'>Your Staked PRTs</div>
          <div className='font-semibold'>3.46</div>
        </div>
      </div>
    </div>
  )
}
