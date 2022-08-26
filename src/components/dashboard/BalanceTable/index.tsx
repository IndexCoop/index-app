import { BigNumber } from 'ethers'
import { colors, useICColorMode } from 'styles/colors'

import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'

import { Token } from 'constants/tokens'
import { useBalanceData } from 'providers/Balances'

import BalanceTableRow from './BalanceTableRow'

export interface BalanceTableItem {
  token: Token
  balance: BigNumber
  price: number
}

const BalanceTable = () => {
  const { isDarkMode } = useICColorMode()
  const colorScheme = isDarkMode ? 'whiteAlpha' : 'blackAlpha'
  const { tokenBalances } = useBalanceData()
  console.log('tokenBalances', tokenBalances)

  return (
    <Table
      colorScheme={colorScheme}
      width={['340px', '400px', '800px', '1024px']}
    >
      <TableHeader />
      <Tbody>
        {Object.entries(tokenBalances).map(([key, balances]) => {
          console.log('key', key)
          return <BalanceTableRow key={key} item={balances} />
        })}
      </Tbody>
    </Table>
  )
}

const TableHeader = () => {
  return (
    <Thead>
      <Tr>
        <Th style={{ color: colors.icBlue2 }}>Token</Th>
        <Th style={{ color: colors.icBlue2 }}>Mainnet</Th>
        <Th style={{ color: colors.icBlue2 }}>Polygon</Th>
        <Th style={{ color: colors.icBlue2 }}>Optimism</Th>
        <Th style={{ color: colors.icBlue2 }}>Value</Th>
      </Tr>
    </Thead>
  )
}

export default BalanceTable
