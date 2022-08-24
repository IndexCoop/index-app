import { BigNumber } from 'ethers'
import { colors, useICColorMode } from 'styles/colors'

import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'

import indexNames, { Token } from 'constants/tokens'
import { TokenContextKeys, useMarketData } from 'providers/MarketData'

import BalanceTableRow from './BalanceTableRow'

export interface BalanceTableItem {
  token: Token
  balance: BigNumber
  price: number
}

interface BalanceTableProps {
  items: BalanceTableItem[]
}

const BalanceTable = ({ items }: BalanceTableProps) => {
  const { isDarkMode } = useICColorMode()
  const colorScheme = isDarkMode ? 'whiteAlpha' : 'blackAlpha'
  const marketData = useMarketData()

  const getTokenMarketData = (tokenContextKey?: TokenContextKeys) => {
    if (tokenContextKey && tokenContextKey !== 'selectLatestMarketData') {
      return {
        hourlyPrices: marketData[tokenContextKey]?.hourlyPrices,
        prices: marketData[tokenContextKey]?.prices,
      }
    }
  }

  const appendTokenValue = ({
    token,
    balance,
    hourlyPrices,
    prices,
  }: {
    token: Token
    balance: BigNumber
    hourlyPrices?: number[][]
    prices?: number[][]
  }): BalanceTableItem => {
    return {
      token,
      balance,
      price: 0,
    }
  }

  const tokensWithMarketData = () =>
    indexNames.map((token) => {
      return appendTokenValue({
        token,
        ...getTokenMarketData(token.tokenContextKey),
      })
    })

  return (
    <Table
      colorScheme={colorScheme}
      width={['340px', '400px', '800px', '1024px']}
    >
      <TableHeader />
      <Tbody>
        {items.map((item, index) => (
          <BalanceTableRow key={index} item={item} />
        ))}
      </Tbody>
    </Table>
  )
}

const TableHeader = () => {
  return (
    <Thead>
      <Tr>
        <Th style={{ color: colors.icBlue2 }}>Token</Th>
        <Th style={{ color: colors.icBlue2 }}>Balance</Th>
        <Th style={{ color: colors.icBlue2 }}>Value</Th>
      </Tr>
    </Thead>
  )
}

export default BalanceTable
