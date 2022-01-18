import { PureComponent } from 'react'

import { Cell, Pie, PieChart } from 'recharts'

import { Box, Flex, Text } from '@chakra-ui/react'

interface Position {
  title: string
  bgColor: string
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
          strokeWidth={1}
        >
          {data.map((item, index) => (
            <Cell key={`cell-${index}`} fill={item.color} />
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
        backgroundColor={position.bgColor}
        borderColor={position.color}
        borderWidth='thin'
      />
      <Text>{position.title}</Text>
    </Flex>
  )
}

const AllocationChart = () => {
  const positions: Position[] = [
    {
      title: 'Liquidity Mining',
      bgColor: 'whiteAlpha.400',
      color: 'black',
      value: 800,
    },
    {
      title: 'DPI',
      bgColor: 'purpleAlpha.400',
      color: 'purple',
      value: 50,
    },
    {
      title: 'MVI',
      bgColor: 'greenAlpha.400',
      color: 'green',
      value: 150,
    },
  ]

  return (
    <Flex w='100%' minH='240'>
      <Box my='20px' mr='80px'>
        <Chart data={positions} />
      </Box>
      <Flex direction='column' my='32px' w='100%'>
        {positions.map((position) => (
          <PositionItem key={position.title} position={position} />
        ))}
      </Flex>
    </Flex>
  )
}

export default AllocationChart
