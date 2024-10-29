import { usePrtStakingContext } from '@/app/(light)/prt-staking/provider'
import { formatAmount } from '@/lib/utils'

export function StakedPanel() {
  const { poolStakedBalanceFormatted, userStakedBalanceFormatted } =
    usePrtStakingContext()
  return (
    <div className='bg-ic-gray-50 border-ic-gray-300 my-3 rounded-xl border'>
      <div className='divide-ic-gray-300 flex w-full divide-x text-sm'>
        <div className='text-ic-gray-600 w-1/2 px-3 py-5'>
          <div className='mb-2'>Total PRTs Staked</div>
          <div className='font-semibold'>
            {formatAmount(poolStakedBalanceFormatted)}
          </div>
        </div>
        <div className='text-ic-gray-600 w-1/2 px-3 py-5'>
          <div className='mb-2'>Your Staked PRTs</div>
          <div className='font-semibold'>
            {formatAmount(userStakedBalanceFormatted)}
          </div>
        </div>
      </div>
    </div>
  )
}
