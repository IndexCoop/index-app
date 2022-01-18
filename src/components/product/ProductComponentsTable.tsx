import React, { useState } from 'react'

import numeral from 'numeral'

import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'

import { SetComponent } from 'contexts/SetComponents/SetComponentsProvider'
import { POLYGON_CHAIN_DATA } from 'utils/connectors'

const ProductComponentsTable = (props: { components?: SetComponent[] }) => {
  const [amountToDisplay, setAmountToDisplay] = useState<number>(5)
  const showAllComponents = () =>
    setAmountToDisplay(props.components?.length || amountToDisplay)
  const showDefaultComponents = () => setAmountToDisplay(5)
  const { chainId } = useEthers()

  const renderTableDisplayControls = () => {
    if (!props.components) return null

    if (amountToDisplay < props.components.length) {
      return (
        <Text onClick={showAllComponents}>
          +{props.components.length - amountToDisplay} More
        </Text>
      )
    }

    if (props.components.length < 5) return null

    return <Text onClick={showDefaultComponents}>Show Less</Text>
  }

  console.log('comps', props.components)
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
    <Flex title='Allocations'>
      <Table variant='simple'>
        <Thead>
          <Tr>
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
    <Tr>
      <Td>{props.component.name}</Td>
      <Td isNumeric>{formattedPriceUSD}</Td>
      <Td isNumeric>{absPercentChange}</Td>
    </Tr>
  )
}

export default ProductComponentsTable
