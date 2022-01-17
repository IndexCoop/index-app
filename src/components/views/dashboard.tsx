import { Box, Button, Flex, Link, Text, VStack } from '@chakra-ui/react'

import TransactionHistoryItem from 'components/dashboard/TransactionHistoryItem'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import SectionTitle from 'components/SectionTitle'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'

const DownloadCsvView = () => {
  return (
    <Link href={''} isExternal>
      <Text style={{ color: '#B9B6FC' }}>Download CSV</Text>
    </Link>
  )
}

const Dashboard = () => {
  const { dpi } = useMarketData()
  const historyItems = [
    { title: 'hello1', date: '1217837268098', url: 'https://etherscan.io/' },
    { title: 'hello2', date: '1217837268098', url: 'https://etherscan.io/' },
    { title: 'hello3', date: '1217837268098', url: 'https://etherscan.io/' },
  ]

  return (
    <Page>
      <Box minW='1280px' mx='auto'>
        <PageTitle
          title='My Page'
          subtitle='Short overview of your Index Coop Tokens'
        />
        <Box my={12}>
          <Flex direction='row'>
            <SectionTitle title='Total Value' />
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
