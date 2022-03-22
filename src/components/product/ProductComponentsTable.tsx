import { useState } from 'react'

import numeral from 'numeral'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import { colors } from 'styles/colors'

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
import PieChartTooltip from 'components/dashboard/PieChartTooltip'
import { MAINNET, POLYGON } from 'constants/chains'
import { Token } from 'constants/tokens'
import { SetComponent } from 'providers/SetComponents/SetComponentsProvider'
import { displayFromWei } from 'utils'

const randomColors = new Array(50)
  .fill('')
  .map((_) => '#' + (((1 << 24) * Math.random()) | 0).toString(16))

const allocationEmptyMsg = (
  tokenData: Token,
  account?: string | null,
  chainId?: number
) => {
  if (!account || !chainId) return 'Connect wallet to view allocations'
  switch (chainId) {
    case MAINNET.chainId:
      if (!tokenData.address && tokenData.polygonAddress) {
        return 'Switch wallet to Polygon to view allocations'
      }
      return 'Connect wallet to view allocations'
    case POLYGON.chainId:
      if (!tokenData.polygonAddress && tokenData.address) {
        return 'Switch wallet to Ethereum Mainnet to view allocations'
      }
      return 'Connect wallet to view allocations'
    default:
      return 'Connect wallet to view allocations'
  }
}

const ProductComponentsTable = (props: {
  components?: SetComponent[]
  tokenData: Token
}) => {
  const { account, chainId } = useEthers()

  const [amountToDisplay, setAmountToDisplay] = useState<number>(5)
  const showAllComponents = () =>
    setAmountToDisplay(props.components?.length || amountToDisplay)
  const showDefaultComponents = () => setAmountToDisplay(5)

  const mapSetComponentToPosition = (
    component: SetComponent,
    index: number
  ) => {
    const randomColor = randomColors[index]
    const position: Position = {
      title: component.symbol,
      value: +component.percentOfSet,
      percent: `${displayFromWei(component.percentOfSetNumber, 2)}%` ?? '',
      color: randomColor,
      backgroundColor: randomColor,
    }
    return position
  }

  const renderTableDisplayControls = () => {
    if (!props.components || props.components.length < 5) return null

    return (
      <Box my='20px'>
        {amountToDisplay < props.components.length ? (
          <Text cursor='pointer' onClick={showAllComponents}>
            Show Complete List
          </Text>
        ) : (
          <Text cursor='pointer' onClick={showDefaultComponents}>
            Show Less
          </Text>
        )}
      </Box>
    )
  }

  if (props.components === undefined || props.components.length === 0) {
    return (
      <Text title='Allocations'>
        {allocationEmptyMsg(props.tokenData, account, chainId)}
      </Text>
    )
  }

  return (
    <Flex direction={['column', 'column', 'row']} alignItems='start'>
      <Box margin={['0 auto', '0 auto', '0 64px 0 0']}>
        <Chart data={props.components.map(mapSetComponentToPosition)} />
      </Box>
      <Flex direction='column' alignItems='center' mt={['32px', '32px', '0']}>
        <Table variant='simple'>
          <Thead>
            <Tr borderBottom='1px'>
              <Th p={['8px 8px', '8px 8px', '12px 24px']}>Token</Th>
              <Th isNumeric p={['8px 8px', '8px 8px', '12px 24px']}>
                Value Per Token
              </Th>
              <Th isNumeric p={['8px 8px', '8px 8px', '12px 24px']}>
                24hr Change
              </Th>
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

  const percentChange = parseFloat(props.component.dailyPercentChange)
  const absPercentChange = numeral(Math.abs(percentChange)).format('0.00')
  const percentChangeIsPositive = percentChange >= 0
  const percentChangeTextColor = percentChangeIsPositive
    ? colors.icMalachite
    : colors.icRed
  const percentChangeSign = percentChangeIsPositive ? '+' : '-'

  return (
    <Tr borderBottom='1px'>
      <Td p={['16px 8px', '16px 8px', '16px 24px']}>
        <Flex alignItems='center'>
          <Image
            borderRadius='full'
            boxSize='30px'
            src={props.component.image}
            alt={props.component.name}
            marginRight='10px'
          />
          <Text fontWeight='500'>{props.component.name}</Text>
        </Flex>
      </Td>
      <Td isNumeric p={['16px 8px', '16px 8px', '16px 24px']}>
        {formattedPriceUSD}
      </Td>
      <Td
        isNumeric
        color={percentChangeTextColor}
        p={['16px 8px', '16px 8px', '16px 24px']}
      >
        {percentChangeSign}
        {absPercentChange}%
      </Td>
    </Tr>
  )
}

const Chart = (props: { data: Position[] }) => {
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

export default ProductComponentsTable
