import { useICColorMode } from 'styles/colors'

import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'

import TransactionHistoryRow from './TransactionHistoryRow'

export interface TransactionHistoryItem {
  hash: string
  type: 'Send' | 'Receive'
  asset: string
  date: string
  from?: string
  to?: string
  value: number
  explorerUrl: string
}

interface TransactionHistoryTableProps {
  items: TransactionHistoryItem[]
}

const TransactionHistoryTable = ({ items }: TransactionHistoryTableProps) => {
  const { isDarkMode } = useICColorMode()
  const colorScheme = isDarkMode ? 'whiteAlpha' : 'blackAlpha'
  return (
    <Table colorScheme={colorScheme}>
      <TableHeader />
      <Tbody>
        {items.map((item, index) => (
          <TransactionHistoryRow key={index} item={item} />
        ))}
      </Tbody>
    </Table>
  )
}

const TableHeader = () => (
  <Thead>
    <Tr>
      <Th>Action</Th>
      <Th></Th>
      <Th>From</Th>
      <Th></Th>
      <Th>To</Th>
      <Th>Transaction</Th>
      <Th></Th>
    </Tr>
  </Thead>
)

export default TransactionHistoryTable
