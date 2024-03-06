import { LeverageChart } from './components/leverage-chart'
import { LeverageWidget } from './components/leverage-widget'
import { Stats } from './components/stats'
import { Title } from './components/title'

export default function Page() {
  return (
    <div className='flex'>
      <div className='mx-auto flex flex-col gap-6 p-12'>
        <div className='flex flex-row gap-36'>
          <Title />
          <Stats />
        </div>
        <div className='flex flex-row gap-6'>
          <LeverageChart />
          <LeverageWidget />
        </div>
      </div>
    </div>
  )
}
