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
import { colors } from 'styles/colors'

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
  let negativeValue =
    props.data[0].value < 0 ? props.data[0].value : props.data[1].value
  let positiveValue =
    props.data[0].value >= 0 ? props.data[0].value : props.data[1].value
  const data = [
    {
      uv: negativeValue,
      pv: positiveValue,
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
      <Bar dataKey='pv' fill={colors.icMalachite} />
      <Bar dataKey='uv' fill={colors.icApricot} />
    </BarChart>
  )
}

export default Chart
