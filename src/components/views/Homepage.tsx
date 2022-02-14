import { useEffect, useState } from 'react'

import { Box, Flex, Link, Text } from '@chakra-ui/react'

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
import { useBalances } from 'hooks/useBalances'
import {
  TokenMarketDataValues,
  useMarketData,
} from 'providers/MarketData/MarketDataProvider'
import { getTransactionHistory } from 'utils/alchemyApi'

import { getPieChartPositions, QuickTradeData } from './DashboardData'

const DownloadCsvView = () => {
  return (
    <Link href={''} isExternal>
      <Text style={{ color: '#B9B6FC' }}>Download CSV</Text>
    </Link>
  )
}

const Dashboard = () => {
  const {
    bedBalance,
    dataBalance,
    dpiBalance,
    mviBalance,
    gmiBalance,
    ethFliBalance,
    btcFliBalance,
    ethFliPBalance,
  } = useBalances()
  const { bed, data, dpi, mvi, gmi, btcfli, ethfli, ethflip } = useMarketData()

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

  const top4Positions = pieChartPositions
    .filter((pos) => pos.title !== 'OTHERS')
    .flatMap((pos) => pos.title)
    .slice(0, 4)

  const tokenMarketData: TokenMarketDataValues[] = top4Positions
    .map((positionTitle) => {
      switch (positionTitle) {
        case 'DPI':
          return dpi
        case 'MVI':
          return mvi
        case 'DATA':
          return data
        case 'BED':
          return bed
        case 'GMI':
          return gmi
        case 'ETH2x-FLI':
          return ethfli
        case 'ETH2x-FLI-P':
          return ethflip
        case 'BTC2x-FLI':
          return btcfli
        default:
          return undefined
      }
    })
    // Remove undefined
    .filter((tokenData): tokenData is TokenMarketDataValues => !!tokenData)
  const marketData = getMarketChartData(tokenMarketData)

  // TODO: get prices and priceChanges
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
              <QuickTrade
                tokenList1={QuickTradeData.tokenList1}
                tokenList2={QuickTradeData.tokenList2}
              />
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
