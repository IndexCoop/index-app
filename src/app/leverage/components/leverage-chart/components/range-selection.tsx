import clsx from 'clsx'
import { useState } from 'react'

type RangeSelectionItemProps = {
  label: string
  isSelected: boolean
  onClick: () => void
}

function RangeSelectionItem({
  label,
  onClick,
  isSelected,
}: RangeSelectionItemProps) {
  const color = isSelected ? 'text-ic-gray-950' : 'text-ic-gray-50'
  const backgroundColor = isSelected ? 'bg-ic-gray-200' : 'none'
  return (
    <div
      className={clsx('cursor-pointer rounded-lg px-2 py-3', backgroundColor)}
      onClick={onClick}
    >
      <div className={clsx('text-xs font-semibold', color)}>{label}</div>
    </div>
  )
}

const range = ['1H', '1D', '1W', '1M', '1Y', 'ALL']
export function RangeSelection() {
  const [selected, setSelected] = useState(3)
  return (
    <div className='flex flex-row gap-6'>
      {range.map((range, index) => (
        <RangeSelectionItem
          key={index}
          label={range}
          isSelected={selected === index}
          onClick={() => setSelected(index)}
        />
      ))}
    </div>
  )
}
