import React, { useState } from 'react'

import numeral from 'numeral'

import { Flex, Text } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'

import { SetComponent } from 'contexts/SetComponents/SetComponentsProvider'
import { POLYGON_CHAIN_DATA } from 'utils/connectors'

interface ProductIndexComponentsProps {
  components?: SetComponent[]
}

const ProductComponentsTable: React.FC<ProductIndexComponentsProps> = ({
  components,
}) => {
  const [amountToDisplay, setAmountToDisplay] = useState<number>(5)
  const showAllComponents = () =>
    setAmountToDisplay(components?.length || amountToDisplay)
  const showDefaultComponents = () => setAmountToDisplay(5)
  const { chainId } = useEthers()

  const renderTableDisplayControls = () => {
    if (!components) return null

    if (amountToDisplay < components.length) {
      return (
        <Text onClick={showAllComponents}>
          +{components.length - amountToDisplay} More
        </Text>
      )
    }

    if (components.length < 5) return null

    return <Text onClick={showDefaultComponents}>Show Less</Text>
  }

  if (
    chainId &&
    chainId === POLYGON_CHAIN_DATA.chainId &&
    (components === undefined || components.length === 0)
  ) {
    return (
      <Text title='Allocations'>
        Connect wallet to Mainnet to view allocations
      </Text>
    )
  } else if (components === undefined || components.length === 0) {
    return <Text title='Allocations'>Connect wallet to view allocations</Text>
  }
  return (
    <Flex title='Allocations'>
      {/* <IndexComponentsTable>
        <div>{/** empty space for logo in header }</div>
        <StyledNameColumn>
          <StyledTableHeader>Name</StyledTableHeader>
        </StyledNameColumn>

        <DisplayOnDesktopOnly>
          <StyledTableHeader>Quantity per token</StyledTableHeader>
        </DisplayOnDesktopOnly>
        <DisplayOnDesktopOnly>
          <StyledTableHeader>Value per token</StyledTableHeader>
        </DisplayOnDesktopOnly>

        <StyledTableHeader>Allocation</StyledTableHeader>
        <StyledTableHeader>24hr Change</StyledTableHeader>

        {components?.slice(0, amountToDisplay).map((data) => (
          <ComponentRow key={data.name} component={data} />
        ))}
      </IndexComponentsTable> */}

      {renderTableDisplayControls()}
    </Flex>
  )
}

interface ComponentRowProps {
  component: SetComponent
}

const ComponentRow: React.FC<ComponentRowProps> = ({ component }) => {
  const {
    symbol,
    quantity,
    percentOfSet,
    totalPriceUsd,
    dailyPercentChange,
    image,
    name,
  } = component
  const formattedPriceUSD = numeral(totalPriceUsd).format('$0,0.00')

  const absPercentChange = numeral(
    Math.abs(parseFloat(dailyPercentChange))
  ).format('0.00')

  return <>Set Component Row </>
}

export default ProductComponentsTable
