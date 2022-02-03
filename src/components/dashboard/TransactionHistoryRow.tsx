import { Box, Flex, Image, Link, Td, Text, Tr } from '@chakra-ui/react'

import historyLinkIcon from 'assets/history-link-icon.svg'
import arrowAsset from 'assets/ic_arrow_right_24.svg'

import { TransactionHistoryItem } from './TransactionHistoryTable'

const TransactionHistoryRow = (props: { item: TransactionHistoryItem }) => {
  const { item } = props
  return (
    <Tr>
      <Td>
        <Flex align='center'>
          <Flex
            align='center'
            backgroundColor='#B9B6FC'
            borderRadius='8px'
            justify='center'
            padding='4px 8px'
          >
            <Text color='#4A4AFF' fontSize='12px' fontWeight='500'>
              {item.type}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>
        <Flex direction='column'>
          <Text>${item.asset}</Text>
          <Text color='#B9B6FC'>{item.value}</Text>
        </Flex>
      </Td>
      <Td>{item.to}</Td>
      <Td>
        <Image src={arrowAsset} alt='arrow pointing right' />
      </Td>
      <Td>{item.from}</Td>
      <Td>
        <Flex direction='column'>
          <Text color='gray'>{item.hash}</Text>
          <Text>Block {item.date}</Text>
        </Flex>
      </Td>
      <Td>
        <Link href={item.explorerUrl} isExternal>
          <Flex align='center' direction='row' justify='end'>
            View More{' '}
            <Box px='2.5' py='1.5'>
              <Image src={historyLinkIcon} alt='link icon' />
            </Box>
          </Flex>
        </Link>
      </Td>
    </Tr>
  )
}

export default TransactionHistoryRow
