import { useEffect, useState } from 'react'

import { colors, useICColorMode } from 'styles/colors'

import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'

import { useBalanceData } from 'providers/Balances'

import BalanceTableRow from './BalanceTableRow'

const BalanceTable = () => {
  const { isDarkMode } = useICColorMode()
  const colorScheme = isDarkMode ? 'whiteAlpha' : 'blackAlpha'
  const { tokenBalances } = useBalanceData()
  const [rows, setRows] = useState<JSX.Element[]>([])

  const renderRows = () => {
    return Object.entries(tokenBalances).map(([key, balances]) => {
      console.log('key', key)
      return <BalanceTableRow key={key} item={balances} />
    })
  }
  useEffect(() => {
    setTimeout(() => {
      setRows(renderRows())
    }, 3000)
  }, [tokenBalances])

  return (
    <Table
      colorScheme={colorScheme}
      width={['340px', '400px', '800px', '1024px']}
    >
      <Thead>
        <Tr>
          <Th style={{ color: colors.icBlue2 }}>Token</Th>
          <Th isNumeric={true} style={{ color: colors.icBlue2 }}>
            Mainnet
          </Th>
          <Th isNumeric={true} style={{ color: colors.icBlue2 }}>
            Polygon
          </Th>
          <Th isNumeric={true} style={{ color: colors.icBlue2 }}>
            Optimism
          </Th>
          {/* <Th isNumeric={true} style={{ color: colors.icBlue2 }}>
            Value
          </Th> */}
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  )
}

export default BalanceTable
