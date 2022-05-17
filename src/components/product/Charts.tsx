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

const Chart = (props: {
  data: Position[]
  isLeveragedToken?: boolean
  vAssets?: Position[]
}) => {
  if (props.isLeveragedToken)
    return <LeveragedChart data={props.data} vAssets={props.vAssets} />
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

const LeveragedChart = (props: {
  data: Position[]
  vAssets: Position[] | undefined
}) => {
  let data
  if (props.vAssets) {
    data = [
      {
        data0: props.data[0].value,
        data1: props.data[1].value,
      },
      {
        data0: props.vAssets[1].value,
        data1: props.vAssets[0].value,
      },
    ]
  } else {
    data = [
      {
        data0: props.data[0].value,
        data1: props.data[1].value,
      },
    ]
  }
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
      <Bar dataKey='data0' fill={colors.icMalachite} />
      <Bar dataKey='data1' fill={colors.icApricot} />
    </BarChart>
  )
}

export default Chart
