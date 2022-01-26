import { useEffect, useState } from 'react'

import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import AllocationChart, { Position } from 'components/dashboard/AllocationChart'
import TransactionHistoryItemView, {
  TransactionHistoryItem,
} from 'components/dashboard/TransactionHistoryItem'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import SectionTitle from 'components/SectionTitle'
import { useBalances } from 'hooks/useBalances'
import { AlchemyApiTransaction, getTransactionHistory } from 'utils/alchemyApi'

function getNumber(balance: BigNumber | undefined): number {
  if (balance === undefined) return -1
  return parseInt(balance.toString())
}

function getPosition(
  title: string,
  bigNumber: BigNumber | undefined
): Position | null {
  const value = getNumber(bigNumber)
  if (value <= 0) {
    return null
  }

  return {
    title,
    // TODO: how should colors be assigned? randomly?
    // TODO: which colors to use?
    backgroundColor: 'whiteAlpha.400',
    color: 'white',
    value,
  }
}

const DownloadCsvView = () => {
  return (
    <Link href={''} isExternal>
      <Text style={{ color: '#B9B6FC' }}>Download CSV</Text>
    </Link>
  )
}

function createHistoryItems(
  transactions: AlchemyApiTransaction[]
): TransactionHistoryItem[] {
  const items: TransactionHistoryItem[] = transactions.map((tx) => {
    const blockNum = tx.blockNum
    // TODO: get timestamp from block number
    // TODO: convert timestamp to date
    const date = ''
    // TODO: determine type
    // 'Send' | 'Receive'
    const type = 'Receive'
    return {
      type,
      date,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      explorerUrl: `https://etherscan.io/tx/${tx.hash}`,
    }
  })
  return items
}

const Dashboard = () => {
  const { account } = useEthers()
  const [historyItems, setHistoryItems] = useState<TransactionHistoryItem[]>([])

  useEffect(() => {
    if (account === null || account === undefined) return
    const fetchHistory = async () => {
      const transactions = await getTransactionHistory(account)
      const historyItems = createHistoryItems(transactions)
      setHistoryItems(historyItems)
    }
    fetchHistory()
  }, [account])

  const {
    dpiBalance,
    mviBalance,
    bedBalance,
    dataBalance,
    gmiBalance,
    ethFliBalance,
    btcFliBalance,
    ethFliPBalance,
  } = useBalances()

  const tempPositions = [
    { title: 'DPI', value: dpiBalance },
    { title: 'MVI', value: mviBalance },
    { title: 'DATA', value: dataBalance },
    { title: 'BED', value: bedBalance },
    { title: 'GMI', value: gmiBalance },
    { title: 'ETH2x-FLI', value: ethFliBalance },
    { title: 'ETH2x-FLI-P', value: ethFliPBalance },
    { title: 'BTC2x-FLI', value: btcFliBalance },
  ]

  const positions = tempPositions.flatMap((tempPosition) => {
    const position = getPosition(tempPosition.title, tempPosition.value)
    if (position === null) {
      return []
    }
    return [position]
  })

  return (
    <Page>
      <Box minW='1280px' mx='auto'>
        <PageTitle
          title='My Page'
          subtitle='Short overview of your Index Coop Tokens'
        />
        <Box my={12}>
          <Flex direction='row'>
            <Flex direction='column' justifyContent='space-around' w='40%'>
              <SectionTitle title='Total Value' />
              <AllocationChart positions={positions} />
            </Flex>
            <Box w='120px' />
            <SectionTitle title='Rewards' />
          </Flex>
        </Box>
        <Box>
          <SectionTitle
            title='Transaction History'
            itemRight={<DownloadCsvView />}
          />
          {historyItems.map((item, index) => (
            <TransactionHistoryItemView key={index} item={item} my='3.5' />
          ))}
        </Box>
      </Box>
    </Page>
  )
}

export default Dashboard
