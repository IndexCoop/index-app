import React, { useEffect, useState } from 'react'

import numeral from 'numeral'
import { Cell, Pie, PieChart } from 'recharts'

import {
  Box,
  Flex,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'

import { Position } from 'components/dashboard/AllocationChart'
import { SetComponent } from 'providers/SetComponents/SetComponentsProvider'
import { POLYGON_CHAIN_DATA } from 'utils/connectors'

const ProductComponentsTable = (props: { components?: SetComponent[] }) => {
  const [amountToDisplay, setAmountToDisplay] = useState<number>(5)
  const showAllComponents = () =>
    setAmountToDisplay(props.components?.length || amountToDisplay)
  const showDefaultComponents = () => setAmountToDisplay(5)
  const { chainId } = useEthers()

  const mapSetComponentToPosition = (component: SetComponent) => {
    const position: Position = {
      title: component.symbol,
      value: +component.percentOfSet,
      color: '#008099',
      backgroundColor: '#8884d8',
    }
    return position
  }

  const renderTableDisplayControls = () => {
    if (!props.components || props.components.length < 5) return null

    if (amountToDisplay < props.components.length)
      return <Text onClick={showAllComponents}>Show Complete List</Text>

    return <Text onClick={showDefaultComponents}>Show Less</Text>
  }

  if (
    chainId &&
    chainId === POLYGON_CHAIN_DATA.chainId &&
    (props.components === undefined || props.components.length === 0)
  ) {
    return (
      <Text title='Allocations'>
        Connect wallet to Mainnet to view allocations
      </Text>
    )
  } else if (props.components === undefined || props.components.length === 0) {
    return <Text title='Allocations'>Connect wallet to view allocations</Text>
  }
  return (
    <Flex title='Allocations' direction='row' alignItems='start' width='60vw'>
      <Chart data={props.components.map(mapSetComponentToPosition)} />
      <Flex direction='column' alignItems='center'>
        <Table variant='simple'>
          <Thead>
            <Tr borderBottom='2px'>
              <Th>Token</Th>
              <Th isNumeric>Value Per Token</Th>
              <Th isNumeric>24hr Change</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.components?.slice(0, amountToDisplay).map((data) => (
              <ComponentRow key={data.name} component={data} />
            ))}
          </Tbody>
        </Table>

        {renderTableDisplayControls()}
      </Flex>
    </Flex>
  )
}

/**
 *
 * @param component a SetComponent object to display
 * @returns a component row JSX element
 */
const ComponentRow = (props: { component: SetComponent }) => {
  const formattedPriceUSD = numeral(props.component.totalPriceUsd).format(
    '$0,0.00'
  )

  const absPercentChange = numeral(
    Math.abs(parseFloat(props.component.dailyPercentChange))
  ).format('0.00')

  return (
    <Tr borderBottom='2px'>
      <Td>
        <Flex alignItems='center'>
          <Image
            borderRadius='full'
            boxSize='30px'
            src={props.component.image}
            alt={props.component.name}
            marginRight='10px'
          />
          {props.component.name}
        </Flex>
      </Td>
      <Td isNumeric>{formattedPriceUSD}</Td>
      <Td isNumeric>{absPercentChange}</Td>
    </Tr>
  )
}

const Chart = (props: { data: Position[] }) => {
  return (
    <Box margin='70px 30px 0 30px'>
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
      </PieChart>
    </Box>
  )
}

export default ProductComponentsTable
