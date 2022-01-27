import { PureComponent } from 'react'

import { Cell, Pie, PieChart } from 'recharts'

import { Box, Flex, Text } from '@chakra-ui/react'

export interface Position {
  title: string
  backgroundColor: string
  color: string
  value: number
  percent?: string
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
          innerRadius={48}
          outerRadius={100}
          startAngle={-270}
          endAngle={90}
          stroke='white'
        >
          {data.map((item, index) => (
            <Cell key={`cell-${index}`} fill={item.backgroundColor} />
          ))}
        </Pie>
      </PieChart>
    )
  }
}

const PositionItem = (props: { position: Position }) => {
  const { position } = props
  return (
    <Flex direction='column' my='6px' w='45%' mr='9px'>
      <Flex alignItems='center'>
        <Box
          w='16px'
          h='16px'
          mr='8px'
          backgroundColor={position.backgroundColor}
          borderColor={position.color}
          borderWidth='thin'
        />
        <Text fontSize='18px' fontWeight='600'>
          {position.title}
        </Text>
      </Flex>
      <Text fontSize='18px' fontWeight='600'>
        {position.percent ?? ''}
      </Text>
    </Flex>
  )
}

const AllocationChart = (props: { positions: Position[] }) => (
  <Flex
    backgroundColor='#292929'
    border='2px solid #F7F1E4'
    borderRadius='16px'
    direction='column'
    fontWeight='700'
    py='20px'
    px='40px'
  >
    <Text fontSize='24px'>Distribution of Products</Text>
    <Flex w='100%' minH='240'>
      <Box my='40px' mr='48px'>
        <Chart data={props.positions} />
      </Box>
      <Flex my='32px' w='100%' flexWrap='wrap'>
        {props.positions.map((position) => (
          <PositionItem key={position.title} position={position} />
        ))}
      </Flex>
    </Flex>
  </Flex>
)

export default AllocationChart
