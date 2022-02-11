import { useEffect, useState } from 'react'

import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'

import AllocationChart from 'components/dashboard/AllocationChart'
import QuickTrade from 'components/dashboard/QuickTrade'
import { assembleHistoryItems } from 'components/dashboard/TransactionHistoryItems'
import TransactionHistoryTable, {
  TransactionHistoryItem,
} from 'components/dashboard/TransactionHistoryTable'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import MarketChart from 'components/product/MarketChart'
import { getMarketChartData } from 'components/product/PriceChartData'
import SectionTitle from 'components/SectionTitle'
import {
  BedIndex,
  Bitcoin2xFlexibleLeverageIndex,
  DataIndex,
  DefiPulseIndex,
  Ethereum2xFlexibleLeverageIndex,
  GmiIndex,
  IndexToken,
  MetaverseIndex,
} from 'constants/productTokens'
import {
  TokenMarketDataValues,
  useMarketData,
} from 'contexts/MarketData/MarketDataProvider'
import { useBalances } from 'hooks/useBalances'
import { getTransactionHistory } from 'utils/alchemyApi'

import { getPieChartPositions } from './DashboardData'

const tokenList1 = [
  { symbol: 'ETH', icon: '' },
  { symbol: 'DAI', icon: '' },
  { symbol: 'USDC', icon: '' },
]
const tokenList2 = [
  { symbol: 'DPI', icon: DefiPulseIndex.image },
  { symbol: 'MVI', icon: MetaverseIndex.image },
  { symbol: 'BED', icon: BedIndex.image },
  { symbol: 'DATA', icon: DataIndex.image },
  { symbol: 'GMI', icon: GmiIndex.image },
  { symbol: 'ETHFLI', icon: Ethereum2xFlexibleLeverageIndex.image },
  { symbol: 'BTCFLI', icon: Bitcoin2xFlexibleLeverageIndex.image },
  { symbol: 'INDEX', icon: IndexToken.image },
]

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
  const { account } = useEthers()
  const { dpi, mvi, gmi, ethfli, bed } = useMarketData()

  const [historyItems, setHistoryItems] = useState<TransactionHistoryItem[]>([])

  // FIXME: re-add once app is going live
  // useEffect(() => {
  //   if (account === null || account === undefined) return
  //   const fetchHistory = async () => {
  //     const transactions = await getTransactionHistory(account)
  //     const historyItems = assembleHistoryItems(transactions)
  //     setHistoryItems(historyItems)
  //   }
  //   fetchHistory()
  // }, [account])

  const balances = [
    { title: 'DPI', value: dpiBalance },
    { title: 'MVI', value: mviBalance },
    { title: 'DATA', value: dataBalance },
    { title: 'BED', value: bedBalance },
    { title: 'GMI', value: gmiBalance },
    { title: 'ETH2x-FLI', value: ethFliBalance },
    { title: 'ETH2x-FLI-P', value: ethFliPBalance },
    { title: 'BTC2x-FLI', value: btcFliBalance },
  ]

  const pieChartPositions = getPieChartPositions(balances)
  console.log(pieChartPositions)
  // Remove undefined
  // TODO: insert positions of user
  const tokenMarketData: TokenMarketDataValues[] = [
    dpi,
    mvi,
    ethfli,
    bed,
    gmi,
  ].filter((tokenData): tokenData is TokenMarketDataValues => !!tokenData)
  const marketData = getMarketChartData(tokenMarketData)

  const prices = ['$200', '200']
  const priceChanges = ['+10.53 ( +5.89% )', '+10.53 ( +5.89% )', '', '', '']

  // TODO: width should be dynamic
  // TODO: what's min width?
  const width = 1280

  return (
    <Page>
      <Box w={width} mx='auto'>
        <PageTitle title='My Dashboard' subtitle='' />
        <Box my={12}>
          <MarketChart
            marketData={marketData}
            prices={prices}
            priceChanges={priceChanges}
            options={{
              width,
              hideYAxis: false,
            }}
          />
          <Flex direction='row' mt='64px'>
            <Flex direction='column' grow='1' flexBasis='0'>
              <AllocationChart positions={pieChartPositions} />
            </Flex>
            <Box w='24px' />
            <Flex direction='column' grow='1' flexBasis='0'>
              <QuickTrade tokenList1={tokenList1} tokenList2={tokenList2} />
            </Flex>
          </Flex>
        </Box>
        <Box>
          <SectionTitle
            title='Transaction History'
            itemRight={<DownloadCsvView />}
          />
          <TransactionHistoryTable items={historyItems} />
        </Box>
      </Box>
    </Page>
  )
}

export default Dashboard
