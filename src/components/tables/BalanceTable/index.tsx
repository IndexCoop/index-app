import { useEffect, useState } from 'react'

import { colors, useICColorMode } from 'styles/colors'

import {
  Flex,
  Spinner,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'

import indices from 'constants/tokens'
import { BalanceValues, useBalanceData } from 'providers/Balances'

import BalanceTableRow from './BalanceTableRow'

const BalanceTable = () => {
  const { isDarkMode } = useICColorMode()
  const colorScheme = isDarkMode ? 'whiteAlpha' : 'blackAlpha'
  const { tokenBalances, isLoading } = useBalanceData()
  const [rows, setRows] = useState<JSX.Element[]>([])

  const renderRows = (tokenBalances: { [key: string]: BalanceValues }) => {
    return Object.entries(tokenBalances).map(([key, balances]) => {
      return <BalanceTableRow key={key} item={balances} />
    })
  }

  useEffect(() => {
    const filtered = Object.assign(
      {},
      ...Object.entries(tokenBalances)
        .filter(([key, tokenBalance]) => indices.includes(tokenBalance.token))
        .map(([k, v]) => ({ [k]: v }))
    )
    const rows = renderRows(filtered)
    setRows(rows)
  }, [isLoading, tokenBalances])

  if (isLoading)
    return (
      <Flex w={'100%'} justifyContent={'center'}>
        <Spinner />
      </Flex>
    )

  if (!isLoading && rows.length === 0)
    return <Text>You don't have any Index Coop products 😞</Text>

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
