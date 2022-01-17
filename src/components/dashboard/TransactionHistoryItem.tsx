import { Box, Flex, Image, Link, Spacer, Text } from '@chakra-ui/react'

import historyLinkIcon from 'assets/history-link-icon.svg'

interface TransactionHistoryItem {
  title: string
  date: string
  url: string
}

const TransactionHistoryItem = (props: {
  item: TransactionHistoryItem
  my: string
}) => {
  const { item } = props
  return (
    <Link href={item.url} isExternal>
      <Flex my={props.my}>
        <Text>{item.title}</Text>
        <Box px='2.5' py='1.5'>
          <Image src={historyLinkIcon} alt='link icon' />
        </Box>
        <Spacer />
        <Text>{item.date}</Text>
      </Flex>
    </Link>
  )
}

export default TransactionHistoryItem
