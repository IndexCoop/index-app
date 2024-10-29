import { usePrtStakingContext } from '@/app/(light)/prt-staking/provider'
import { formatAmount } from '@/lib/utils'

export function ClaimablePanel() {
  const { claimableRewardsFormatted, lifetimeRewardsFormatted, token } =
    usePrtStakingContext()
  return (
    <div className='bg-ic-gray-50 border-ic-gray-300 my-3 w-full rounded-xl border px-3 py-5 text-sm font-medium'>
      <div className='text-ic-gray-800 mb-2 flex'>
        <div className='flex-1'>Claimable</div>
        <div>{`${formatAmount(claimableRewardsFormatted)} ${token?.rewardTokenData.symbol}`}</div>
      </div>
      <div className='text-ic-gray-600 flex'>
        <div className='flex-1 font-medium'>Lifetime</div>
        <div className='font-bold'>
          {`${formatAmount(lifetimeRewardsFormatted)} ${token?.rewardTokenData.symbol}`}
        </div>
      </div>
    </div>
  )
}
