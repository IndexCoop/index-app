import { Box, Flex, Image, Link, Spacer, Text } from '@chakra-ui/react'

import historyLinkIcon from 'assets/history-link-icon.svg'

export interface TransactionHistoryItem {
  type: 'Send' | 'Receive'
  date: string
  from?: string
  to?: string
  value: number
  explorerUrl: string
}

const TransactionHistoryItemView = (props: {
  item: TransactionHistoryItem
  my: string
}) => {
  const { item, my } = props
  return (
    <Link href={item.explorerUrl} isExternal>
      <Flex my={my}>
        <Text>{item.type}</Text>
        <Box px='2.5' py='1.5'>
          <Image src={historyLinkIcon} alt='link icon' />
        </Box>
        <Spacer />
        <Text>{item.date}</Text>
      </Flex>
    </Link>
  )
}

export default TransactionHistoryItemView
