export function LeverageSelector() {
  return (
    <div className='flex flex-row items-center justify-between rounded-xl border border-[#3A6060] p-4'>
      <div className='text-ic-gray-300 text-xs font-medium'>Leverage</div>
      <div className='flex flex-row gap-2'>
        <LeverageSelectorButton label='-1x' />
        <LeverageSelectorButton label='2x' />
        <LeverageSelectorButton label='3x' />
      </div>
    </div>
  )
}

export function LeverageSelectorButton({ label }: { label: string }) {
  return (
    <div className='text-ic-gray-300 bg-ic-blue-950 w-14 cursor-pointer rounded-full px-3 py-2 text-center text-sm font-bold'>
      {label}
    </div>
  )
}
