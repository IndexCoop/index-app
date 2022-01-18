import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'

import AllocationChart, { Position } from 'components/dashboard/AllocationChart'
import TransactionHistoryItem from 'components/dashboard/TransactionHistoryItem'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import SectionTitle from 'components/SectionTitle'
import { useBalances } from 'hooks/useBalances'

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

const Dashboard = () => {
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

  const historyItems = [
    { title: 'hello1', date: '1217837268098', url: 'https://etherscan.io/' },
    { title: 'hello2', date: '1217837268098', url: 'https://etherscan.io/' },
    { title: 'hello3', date: '1217837268098', url: 'https://etherscan.io/' },
  ]

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
          {historyItems.map((item) => (
            <TransactionHistoryItem key={item.title} item={item} my='3.5' />
          ))}
        </Box>
      </Box>
    </Page>
  )
}

export default Dashboard
