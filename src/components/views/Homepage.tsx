import { useEffect, useRef, useState } from 'react'

import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'

import AllocationChart from 'components/dashboard/AllocationChart'
import { getPieChartPositions } from 'components/dashboard/DashboardData'
import DownloadCsvView from 'components/dashboard/DownloadCsvView'
import QuickTrade from 'components/dashboard/QuickTrade'
import { assembleHistoryItems } from 'components/dashboard/TransactionHistoryItems'
import TransactionHistoryTable, {
  TransactionHistoryItem,
} from 'components/dashboard/TransactionHistoryTable'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import Disclaimer from 'components/product/Disclaimer'
import { PriceChartData } from 'components/product/MarketChart'
import { getPriceChartData } from 'components/product/PriceChartData'
import SectionTitle from 'components/SectionTitle'
import { useAccount } from 'hooks/useAccount'
import { useNetwork } from 'hooks/useNetwork'
import { useUserMarketData } from 'hooks/useUserMarketData'
import { useMarketData } from 'providers/MarketData/MarketDataProvider'
import { getTransactionHistory } from 'utils/alchemyApi'
import { exportCsv } from 'utils/exportToCsv'

const Dashboard = () => {
  const { bed, data, dpi, mvi, gmi, btcfli, ethfli, ethflip } = useMarketData()
  const { userBalances, totalBalanceInUSD, totalHourlyPrices, priceChanges } =
    useUserMarketData()
  const { account } = useAccount()
  const { chainId } = useNetwork()
  const isWeb = useBreakpointValue({
    base: false,
    md: true,
    lg: true,
    xl: true,
  })

  const [csvDownloadUrl, setCsvDownloadUrl] = useState('')
  const [historyItems, setHistoryItems] = useState<TransactionHistoryItem[]>([])
  const [priceChartData, setPriceChartData] = useState<PriceChartData[][]>([])

  const csvDownloadRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    // Set only if chart data wasn't set yet e.g. by using chart type selector
    if (totalHourlyPrices.length < 1 || priceChartData.length > 0) {
      return
    }
    const balanceData = getPriceChartData([{ hourlyPrices: totalHourlyPrices }])
    setPriceChartData(balanceData)
  }, [totalHourlyPrices])

  useEffect(() => {
    if (account === null || account === undefined) return
    const fetchHistory = async () => {
      const chainIdNum = Number(chainId) ?? -1
      const transactions = await getTransactionHistory(account, chainIdNum)
      const historyItems = assembleHistoryItems(transactions)
      setHistoryItems(historyItems)
    }
    fetchHistory()
  }, [account, chainId])

  useEffect(() => {
    if (csvDownloadUrl === '') return
    csvDownloadRef.current?.click()
    URL.revokeObjectURL(csvDownloadUrl)
    setCsvDownloadUrl('')
  }, [csvDownloadUrl])

  const balancesPieChart = userBalances.map((userTokenBalance) => ({
    title: userTokenBalance.symbol,
    balance: userTokenBalance.balance,
    fiat: userTokenBalance.fiat,
  }))
  const pieChartPositions = getPieChartPositions(balancesPieChart)

  const onClickDownloadCsv = () => {
    const csv = exportCsv(historyItems, 'index')
    const blob = new Blob([csv])
    const fileDownloadUrl = URL.createObjectURL(blob)
    setCsvDownloadUrl(fileDownloadUrl)
  }

  const renderCsvDownloadButton =
    historyItems.length > 0 ? (
      <DownloadCsvView
        ref={csvDownloadRef}
        downloadUrl={csvDownloadUrl}
        onClickDownload={onClickDownloadCsv}
      />
    ) : undefined

  return (
    <Page>
      <Flex
        w={['340px', '500px', '820px', '1024px']}
        mx='auto'
        flexDir={'column'}
        justifyContent={'center'}
      >
        <PageTitle title='My Dashboard' subtitle='' />
        <Box mb={12}>
          <Flex
            direction={['column', 'column', 'column', 'row']}
            px={[0, 0, '20px', 0]}
            w={['340px', '500px', '820px', '1024px']}
            h={['auto', 'auto']}
            justifyContent={'center'}
          >
            <Flex direction='column' grow={1} flexBasis='0'>
              <AllocationChart positions={pieChartPositions} />
            </Flex>
            <Box w='24px' h={['10px', '10px', '10px', '0px']} />
            <Flex direction='column' grow={1} flexBasis='0'>
              <QuickTrade />
            </Flex>
          </Flex>
        </Box>
        <Box w={['340px', '500px', '820px', '1024px']} px={[0, 0, '20px', 0]}>
          <SectionTitle
            title='Transaction History'
            itemRight={renderCsvDownloadButton}
          />
          <TransactionHistoryTable items={historyItems.slice(0, 20)} />
        </Box>
        <Disclaimer />
      </Flex>
    </Page>
  )
}

export default Dashboard
