import clsx from 'clsx'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'

import { Spinner } from './spinner'

interface TradeButtonProps {
  label: string
  isDisabled: boolean
  isLoading: boolean
  onClick: () => void
  tooltip?: string | null
}

export const TradeButton = ({
  label,
  isDisabled,
  isLoading,
  onClick,
  tooltip,
}: TradeButtonProps) => {
  const disabled = isLoading || isDisabled

  return (
    <Tooltip>
      <TooltipTrigger
        className={clsx(
          'text-ic-white w-full rounded-3xl px-6 py-4 font-semibold transition duration-300 ease-in-out dark:rounded-3xl dark:text-zinc-800',
          disabled ? 'shadow-none' : 'shadow-[0.5px_1px_2px_0_rgba(0,0,0,0.3)]',
          disabled
            ? 'bg-ic-gray-500'
            : 'bg-ic-blue-600 dark:bg-neutral-50 dark:hover:bg-neutral-200',
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {isLoading ? <Spinner /> : label}
      </TooltipTrigger>
      {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
    </Tooltip>
  )
}
