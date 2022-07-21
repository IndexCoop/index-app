import { colors, useICColorMode } from 'styles/colors'

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
        <Th style={{ color: colors.icBlue2 }}>Action</Th>
        <Th></Th>
        {isWeb && (
          <>
            <Th style={{ color: colors.icBlue2 }}>From</Th>
            {!isTablet && <Th></Th>}
            <Th style={{ color: colors.icBlue2 }}>To</Th>
            {!isTablet && (
              <Th style={{ color: colors.icBlue2 }}>Transaction</Th>
            )}
          </>
        )}
        <Th></Th>
      </Tr>
    </Thead>
  )
}

export default TransactionHistoryTable
