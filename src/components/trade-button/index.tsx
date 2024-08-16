import clsx from 'clsx'

import { Spinner } from './spinner'

interface TradeButtonProps {
  label: string
  isDisabled: boolean
  isLoading: boolean
  onClick: () => void
}

export const TradeButton = ({
  label,
  isDisabled,
  isLoading,
  onClick,
}: TradeButtonProps) => {
  const disabled = isLoading || isDisabled
  return (
    <button
      className={clsx(
        'text-ic-white h-14 w-full rounded-[10px] font-bold',
        disabled ? 'shadow-none' : 'shadow-[0.5px_1px_2px_0_rgba(0,0,0,0.3)]',
        disabled ? 'bg-ic-gray-500' : 'bg-ic-blue-600',
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {isLoading ? <Spinner /> : label}
    </button>
  )
}
