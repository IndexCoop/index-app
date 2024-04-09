type StatsItemProps = {
  title: string
  subtitle: string
}

export function StatsItem({ title, subtitle }: StatsItemProps) {
  return (
    <div className='text-ic-gray-300 ml-5 flex flex-col items-start justify-start py-4 text-sm font-normal'>
      <div>{title}</div>
      <div className='font-semibold'>{subtitle}</div>
    </div>
  )
}

type DepositStatsProps = {
  rewards: string
  userBalance: string
}

export function DepositStats({ rewards, userBalance }: DepositStatsProps) {
  return (
    <div className='flex flex-row rounded-xl border border-[#5D9797]'>
      <div className='flex-1'>
        <StatsItem title={'Deposited'} subtitle={userBalance} />
      </div>
      <div className='flex-1 border-l-[1px] border-[#5D9797]'>
        <StatsItem title={'PRTs earned'} subtitle={rewards} />
      </div>
    </div>
  )
}
