import { useEffect, useRef, useState } from 'react'

import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

import { useNetwork } from 'hooks/useNetwork'
import { useWallet } from 'hooks/useWallet'
import { logEvent } from 'utils/api/analytics'
import { captureDashboardSelection } from 'utils/api/sentry'

import DownloadCsvView from './TransactionHistoryTable/DownloadCsvView'
import { assembleHistoryItems } from './TransactionHistoryTable/TransactionHistoryItems'
import { getTransactionHistory } from './alchemyApi'
import BalanceTable from './BalanceTable'
import { exportCsv } from './exportToCsv'
import SectionTitle from './SectionTitle'
import TransactionHistoryTable, {
  TransactionHistoryItem,
} from './TransactionHistoryTable'

const BalanceHistoryTabs = () => {
  const { address, isConnected } = useWallet()
  const { chainId: networkChainId } = useNetwork()
  const chainId = networkChainId

  const [csvDownloadUrl, setCsvDownloadUrl] = useState('')
  const [historyItems, setHistoryItems] = useState<TransactionHistoryItem[]>([])

  const csvDownloadRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (address === null || address === undefined) return
    const fetchHistory = async () => {
      const chainIdNum = Number(chainId) ?? -1
      const transactions = await getTransactionHistory(address, chainIdNum)
      const historyItems = assembleHistoryItems(transactions)
      setHistoryItems(historyItems)
    }
    fetchHistory()
  }, [address, chainId])

  useEffect(() => {
    if (csvDownloadUrl === '') return
    csvDownloadRef.current?.click()
    URL.revokeObjectURL(csvDownloadUrl)
    setCsvDownloadUrl('')
  }, [csvDownloadUrl])

  const onChangeTab = (index: number) => {
    captureDashboardSelection(index)
  }

  const onClickDownloadCsv = () => {
    const csv = exportCsv(historyItems, 'index')
    const blob = new Blob([csv])
    const fileDownloadUrl = URL.createObjectURL(blob)
    setCsvDownloadUrl(fileDownloadUrl)
    logEvent('DOWNLOAD_CSV', {
      address: address || 'UNCONNECTED',
      chain: chainId || 'UNCONNECTED',
      fileDownloadUrl,
    })
  }

  const renderCsvDownloadButton =
    historyItems.length > 0 ? (
      <DownloadCsvView
        ref={csvDownloadRef}
        downloadUrl={csvDownloadUrl}
        onClickDownload={onClickDownloadCsv}
      />
    ) : undefined

  return isConnected ? (
    <Tabs isLazy mt='48px' onChange={onChangeTab} variant='main'>
      <TabList>
        <Tab>Balances</Tab>
        <Tab>Transaction History</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Box
            w={['340px', '500px', '820px', '1024px']}
            px={[0, 0, '20px', 0]}
            pb={'50px'}
          >
            <BalanceTable />
          </Box>
        </TabPanel>
        <TabPanel>
          <Box w={['340px', '500px', '820px', '1024px']} px={[0, 0, '20px', 0]}>
            <SectionTitle title='' itemRight={renderCsvDownloadButton} />
            <TransactionHistoryTable items={historyItems.slice(0, 20)} />
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  ) : (
    <></>
  )
}

export default BalanceHistoryTabs
