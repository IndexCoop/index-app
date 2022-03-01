import { useICColorMode } from 'styles/colors'

import {
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react'

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
  width?: number
}

const TransactionHistoryTable = ({
  items,
  width,
}: TransactionHistoryTableProps) => {
  const { isDarkMode } = useICColorMode()
  const colorScheme = isDarkMode ? 'whiteAlpha' : 'blackAlpha'
  return (
    <Table colorScheme={colorScheme} w={width}>
      <TableHeader />
      <Tbody>
        {items.map((item, index) => (
          <TransactionHistoryRow key={index} item={item} />
        ))}
      </Tbody>
    </Table>
  )
}

const TableHeader = () => {
  const isWeb = useBreakpointValue({
    base: false,
    md: true,
    lg: true,
    xl: true,
  })
  return (
    <Thead>
      <Tr>
        <Th>Action</Th>
        <Th></Th>
        {isWeb && (
          <>
            <Th>From</Th>
            <Th></Th>
            <Th>To</Th>
            <Th>Transaction</Th>
          </>
        )}

        <Th></Th>
      </Tr>
    </Thead>
  )
}

export default TransactionHistoryTable
