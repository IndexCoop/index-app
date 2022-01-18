import { PureComponent } from 'react'

import { Cell, Pie, PieChart } from 'recharts'

import { Box, Flex, Text } from '@chakra-ui/react'

export interface Position {
  title: string
  backgroundColor: string
  color: string
  value: number
}

class Chart extends PureComponent<{ data: Position[] }> {
  render() {
    const { data } = this.props
    return (
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          dataKey='value'
          cx='50%'
          cy='50%'
          innerRadius={60}
          outerRadius={90}
          startAngle={-270}
          endAngle={90}
        >
          {data.map((item, index) => (
            <Cell
              key={`cell-${index}`}
              fill={item.backgroundColor}
              stroke={item.color}
            />
          ))}
        </Pie>
      </PieChart>
    )
  }
}

const PositionItem = (props: { position: Position }) => {
  const { position } = props
  return (
    <Flex alignItems='center' my='6px'>
      <Box
        w='12px'
        h='12px'
        mr='20px'
        backgroundColor={position.backgroundColor}
        borderColor={position.color}
        borderWidth='thin'
      />
      <Text>{position.title}</Text>
    </Flex>
  )
}

const AllocationChart = (props: { positions: Position[] }) => (
  <Flex w='100%' minH='240'>
    <Box my='20px' mr='80px'>
      <Chart data={props.positions} />
    </Box>
    <Flex direction='column' my='32px' w='100%'>
      {props.positions.map((position) => (
        <PositionItem key={position.title} position={position} />
      ))}
    </Flex>
  </Flex>
)

export default AllocationChart
