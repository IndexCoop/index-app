import { useState } from 'react'

import numeral from 'numeral'
import { colors, pieChartColors } from 'styles/colors'

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

import { Token } from 'constants/tokens'
import { SetComponent } from 'hooks/useTokenComponents'

import Chart, { Position } from './Charts'

const ProductComponentsTable = (props: {
  components?: SetComponent[]
  token: Token
  isLeveragedToken?: boolean
  vAssets?: SetComponent[]
}) => {
  const [amountToDisplay, setAmountToDisplay] = useState<number>(5)
  const showAllComponents = () =>
    setAmountToDisplay(props.components?.length || amountToDisplay)
  const showDefaultComponents = () => setAmountToDisplay(5)

  const priceToNumber = (price: string) => {
    const priceNumber = numeral(price).value()
    return priceNumber || 0
  }

  const mapSetComponentToPosition = (
    component: SetComponent,
    index: number
  ) => {
    const sliceColor = pieChartColors[index]
    const position: Position = {
      title: component.symbol,
      value: props.isLeveragedToken
        ? priceToNumber(component.totalPriceUsd)
        : +component.percentOfSet,
      percent: `${component.percentOfSetNumber.toFixed(1)}%` ?? '',
      color: sliceColor,
      backgroundColor: sliceColor,
    }
    return position
  }

  const renderTableDisplayControls = () => {
    if (!props.components || props.components.length < 5 || props.vAssets)
      return null

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
    return <Text title='Allocations'>Loading...</Text>
  }

  return (
    <Flex direction={['column', 'column', 'row']} alignItems='start'>
      <Box margin={['0 auto', '0 auto', '0 64px 0 0']}>
        <Chart
          data={props.components.map(mapSetComponentToPosition)}
          vAssets={props.vAssets?.map(mapSetComponentToPosition)}
          isLeveragedToken={props.isLeveragedToken}
        />
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
            {props.vAssets && (
              <VirutalAssets
                amountToDisplay={amountToDisplay}
                vAssets={props.vAssets}
              />
            )}
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
const ComponentRow = (props: {
  component: SetComponent
  disablePercentage?: boolean
}) => {
  const formattedPriceUSD = numeral(props.component.totalPriceUsd).format(
    '$0,0.00'
  )

  const percentChange = parseFloat(props.component.dailyPercentChange)
  const absPercentChange = numeral(Math.abs(percentChange)).format('0.00') + '%'
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
        {!props.disablePercentage && percentChangeSign}
        {!props.disablePercentage && absPercentChange}
      </Td>
    </Tr>
  )
}

const VirutalAssets = ({
  amountToDisplay,
  vAssets,
}: {
  amountToDisplay: number
  vAssets?: SetComponent[]
}) => {
  if (!vAssets || vAssets.length < 1) return <></>
  return (
    <>
      <Tr>
        <Th colSpan={3} fontSize='13px' color='gray.500' mt='8px'>
          Virtual Tokens on Perpetual Protocol
        </Th>
      </Tr>
      {vAssets.slice(0, amountToDisplay).map((data) => (
        <ComponentRow
          key={data.name}
          component={data}
          disablePercentage={true}
        />
      ))}
    </>
  )
}

export default ProductComponentsTable
