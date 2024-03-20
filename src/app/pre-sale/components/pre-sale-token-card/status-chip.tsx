import clsx from 'clsx'
import { PreSaleStatus } from '../../types'

type Props = {
  status: PreSaleStatus
}

export function StatusChip({ status }: Props) {
  return (
    <div
      className={clsx('flex rounded-[19px] px-4 py-2 text-xs font-medium', {
        'bg-[#EBF2EE] text-[#0DA942]': status === PreSaleStatus.ACTIVE,
        'text-ic-gray-600 bg-ic-gray-200': status !== PreSaleStatus.ACTIVE,
      })}
    >
      <div
        className={clsx(
          'mr-2 h-2.5 w-2.5 flex-shrink-0 self-center rounded-full',
          {
            'bg-[#04E55E]': status === PreSaleStatus.ACTIVE,
            'bg-ic-gray-400': status !== PreSaleStatus.ACTIVE,
          },
        )}
      />
      {status === PreSaleStatus.ACTIVE ? 'Pre-Sale active' : 'Not Started'}
    </div>
  )
}
