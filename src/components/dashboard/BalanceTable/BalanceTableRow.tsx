import { colors } from 'styles/colors'

import { Flex, Link, Td, Text, Tr } from '@chakra-ui/react'

import { BalanceValues } from 'providers/Balances'

const backgroundColor = colors.icBlue10
const highlightColor = colors.icBlue2

const BalanceTableRow = (props: { item: BalanceValues }) => {
  const { item } = props
  // TODO: balances need formatting
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
              <Link href={item.token.url}>{item.token.symbol}</Link>
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>
        <Text>{item.mainnetBalance.toString()}</Text>
      </Td>
      <Td>
        <Text>{item.polygonBalance.toString()}</Text>
      </Td>
      <Td>
        <Text>{item.optimismBalance.toString()}</Text>
      </Td>
      <Td>{item.price}</Td>
    </Tr>
  )
}

export default BalanceTableRow
