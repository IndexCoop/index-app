import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { colors } from 'styles/colors'

import { Flex, Link, Td, Text, Tr } from '@chakra-ui/react'

import { BalanceValues } from 'providers/Balances'

const backgroundColor = colors.icBlue10
const highlightColor = colors.icBlue2

const BalanceTableRow = (props: { item: BalanceValues }) => {
  const { item } = props

  const formatBalance = (number: BigNumber | null): string =>
    !number ? 'N/A' : Number(formatUnits(number, 18)).toFixed(4)

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
      <Td isNumeric={true}>
        <Text>{formatBalance(item.mainnetBalance)}</Text>
      </Td>
      <Td isNumeric={true}>
        <Text>{formatBalance(item.polygonBalance)}</Text>
      </Td>
      <Td isNumeric={true}>
        <Text>{formatBalance(item.optimismBalance)}</Text>
      </Td>
      {/* <Td isNumeric={true}>{item.price}</Td> */}
    </Tr>
  )
}

export default BalanceTableRow
