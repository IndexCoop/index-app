import clsx from 'clsx'

export function BuySellSelector() {
  return (
    <div className='bg-ic-blue-950 flex flex-row rounded-md'>
      <BuySellSelectorButton isSelected={true} label='Buy' roundedLeft={true} />
      <BuySellSelectorButton
        isSelected={false}
        label='Sell'
        roundedLeft={false}
      />
    </div>
  )
}

export function BuySellSelectorButton({
  isSelected,
  label,
  roundedLeft,
}: {
  isSelected: boolean
  label: string
  roundedLeft: boolean
}) {
  const textColor = isSelected ? 'text-ic-white' : 'text-ic-gray-500'
  const bgColor = isSelected ? 'bg-ic-blue-600' : 'bg-ic-gray-800'
  return (
    <div className={'bg-ic-blue-950 flex-grow cursor-pointer rounded-md'}>
      <div className={clsx('py-5 text-center text-sm font-bold', textColor)}>
        {label}
      </div>
      <div
        className={clsx(
          'h-1 w-full',
          bgColor,
          roundedLeft ? 'rounded-bl-md' : 'rounded-br-md',
        )}
      ></div>
    </div>
  )
}
