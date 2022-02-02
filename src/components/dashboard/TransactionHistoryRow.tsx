import { Box, Flex, Image, Link, Td, Tr } from '@chakra-ui/react'

import historyLinkIcon from 'assets/history-link-icon.svg'

import { TransactionHistoryItem } from './TransactionHistoryTable'

const TransactionHistoryRow = (props: { item: TransactionHistoryItem }) => {
  const { item } = props
  return (
    <Tr>
      <Td>{item.to}</Td>
      <Td>{item.from}</Td>
      <Td>{item.date}</Td>
      <Td></Td>
      <Td>
        <Link href={item.explorerUrl} isExternal>
          <Flex align='center' direction='row'>
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
