import { StatsMetric } from './stats-metric'

export function LeverageSelectorContainer() {
  const isFetchingStats = false
  return (
    <div className='border-ic-black flex h-full items-center border-l px-16 py-0'>
      <StatsMetric
        className='w-16'
        isLoading={isFetchingStats}
        label='Net Rate'
        value={'0.03%'}
      />
    </div>
  )
}
