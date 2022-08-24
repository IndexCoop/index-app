import { colors } from 'styles/colors'

import { Flex, Td, Text, Tr } from '@chakra-ui/react'

import { BalanceTableItem } from './BalanceTable'

const backgroundColor = colors.icBlue10
const highlightColor = colors.icBlue2

const BalanceTableRow = (props: { item: BalanceTableItem }) => {
  const { item } = props
  // TODO: convert balance to readable string, get price data
  return (
    <Tr width={['340px', '400px', '800px', '1024px']}>
      <Td>
        <Flex align='center'>
          <Flex
            align='center'
            backgroundColor={backgroundColor}
            borderRadius='8px'
            justify='center'
            padding='4px 8px'
          >
            <Text color={highlightColor} fontSize='12px' fontWeight='500'>
              {item.token.symbol}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>
        <Flex direction='column'>
          <Text color={highlightColor}>{item.balance.toString()}</Text>
        </Flex>
      </Td>
      <Td>{item.price}</Td>
    </Tr>
  )
}

export default BalanceTableRow
