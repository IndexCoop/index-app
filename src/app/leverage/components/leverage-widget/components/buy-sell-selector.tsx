import clsx from 'clsx'

type BuySellSelectorProps = {
  isMinting: boolean
  onClick: () => void
}

export function BuySellSelector({ isMinting, onClick }: BuySellSelectorProps) {
  return (
    <div className='bg-ic-blue-950 flex flex-row rounded-md'>
      <BuySellSelectorButton
        isSelected={isMinting === true}
        label='Buy'
        roundedLeft={true}
        onClick={onClick}
      />
      <BuySellSelectorButton
        isSelected={isMinting === false}
        label='Sell'
        roundedLeft={false}
        onClick={onClick}
      />
    </div>
  )
}

export function BuySellSelectorButton({
  isSelected,
  label,
  roundedLeft,
  onClick,
}: {
  isSelected: boolean
  label: string
  roundedLeft: boolean
  onClick: () => void
}) {
  const textColor = isSelected ? 'text-ic-white' : 'text-ic-gray-500'
  const bgColor = isSelected ? 'bg-ic-blue-600' : 'bg-ic-gray-800'
  return (
    <div
      className={
        'bg-ic-blue-950 flex-grow cursor-pointer select-none rounded-md'
      }
      onClick={onClick}
    >
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
