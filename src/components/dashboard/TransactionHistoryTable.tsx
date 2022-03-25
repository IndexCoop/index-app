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
}

const TransactionHistoryTable = ({ items }: TransactionHistoryTableProps) => {
  const { isDarkMode } = useICColorMode()
  const colorScheme = isDarkMode ? 'whiteAlpha' : 'blackAlpha'
  return (
    <Table
      colorScheme={colorScheme}
      width={['340px', '400px', '800px', '1024px']}
    >
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
  const isTablet = useBreakpointValue({
    base: false,
    md: true,
    lg: true,
    xl: false,
  })
  return (
    <Thead>
      <Tr>
        <Th>Action</Th>
        <Th></Th>
        {isWeb && (
          <>
            <Th>From</Th>
            {!isTablet && <Th></Th>}
            <Th>To</Th>
            {!isTablet && <Th>Transaction</Th>}{' '}
          </>
        )}
        <Th></Th>
      </Tr>
    </Thead>
  )
}

export default TransactionHistoryTable
