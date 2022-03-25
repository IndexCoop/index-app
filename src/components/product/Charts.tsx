import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  Tooltip,
  YAxis,
} from 'recharts'

import { Position } from 'components/dashboard/AllocationChart'
import PieChartTooltip from 'components/dashboard/PieChartTooltip'

const Chart = (props: { data: Position[]; isLeveragedToken?: boolean }) => {
  if (props.isLeveragedToken) return <LeveragedChart data={props.data} />
  return <CompositeChart data={props.data} />
}

const CompositeChart = (props: { data: Position[] }) => {
  return (
    <PieChart width={300} height={300}>
      <Pie
        data={props.data}
        dataKey='value'
        cx='50%'
        cy='50%'
        innerRadius={80}
        outerRadius={140}
        startAngle={90}
        endAngle={-360}
        legendType='line'
      >
        {props.data.map((item, index) => (
          <Cell
            key={`cell-${index}`}
            fill={item.backgroundColor}
            stroke={item.color}
          />
        ))}
      </Pie>
      <Tooltip content={<PieChartTooltip />} position={{ x: 150, y: -25 }} />
    </PieChart>
  )
}

const LeveragedChart = (props: { data: Position[] }) => {
  if (props.data.length !== 2) {
    return <CompositeChart data={props.data} />
  }
  const data = [
    {
      data0: props.data[0].value,
      data1: props.data[1].value,
    },
  ]
  return (
    <BarChart
      width={400}
      height={300}
      data={data}
      margin={{
        top: 5,
        bottom: 20,
      }}
    >
      <YAxis />
      <ReferenceLine y={0} />
      <Bar dataKey='data0' fill={props.data[0].color} />
      <Bar dataKey='data1' fill={props.data[1].color} />
    </BarChart>
  )
}

export default Chart
