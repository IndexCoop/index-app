export function ClaimablePanel() {
  return (
    <div className='bg-ic-gray-50 border-ic-gray-300 my-3 w-full rounded-xl border px-3 py-5 text-sm font-medium'>
      <div className='text-ic-gray-800 mb-2 flex'>
        <div className='flex-1'>Claimable</div>
        <div>0.02 HYETH ($70.22)</div>
      </div>
      <div className='text-ic-gray-600 flex'>
        <div className='flex-1 font-medium'>Lifetime</div>
        <div className='font-bold'>0.58 HYETH ($2,895.01)</div>
      </div>
    </div>
  )
}
