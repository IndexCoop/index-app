import { LeverageSelector } from './leverage-selector'
import { StatsMetric } from './stats-metric'

export function LeverageSelectorContainer() {
  const isFetchingStats = false
  return (
    <div className='border-ic-black flex h-full w-2/3 items-center gap-8 border-l px-16 py-0'>
      <LeverageSelector
        leverage={'2x'}
        leverageType={'Long'}
        onClick={() => console.log('select long')}
      />
      <StatsMetric
        className='w-16'
        isLoading={isFetchingStats}
        label='Net Rate'
        value={'0.03%'}
      />
    </div>
  )
}
