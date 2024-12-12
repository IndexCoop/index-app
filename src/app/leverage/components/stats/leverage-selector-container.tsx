import { StatsMetric } from './stats-metric'

export function LeverageSelectorContainer() {
  const isFetchingStats = false
  return (
    <div className='flex'>
      <StatsMetric
        className='w-80'
        isLoading={isFetchingStats}
        label='Net Rate'
        value={'0.03%'}
      />
    </div>
  )
}
