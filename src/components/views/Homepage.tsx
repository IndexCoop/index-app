import { useEffect, useRef, useState } from 'react'

import { useAccount, useNetwork } from 'wagmi'

import { Box, Flex } from '@chakra-ui/react'

import BalanceTable from 'components/dashboard/BalanceTable'
import DownloadCsvView from 'components/dashboard/DownloadCsvView'
import { assembleHistoryItems } from 'components/dashboard/TransactionHistoryItems'
import TransactionHistoryTable, {
  TransactionHistoryItem,
} from 'components/dashboard/TransactionHistoryTable'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import SectionTitle from 'components/SectionTitle'
import QuickTradeContainer from 'components/trade'
import { getTransactionHistory } from 'utils/alchemyApi'
import { logEvent } from 'utils/analytics'
import { exportCsv } from 'utils/exportToCsv'

const Dashboard = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const chainId = chain?.id

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

  return (
    <Page>
      <Flex
        w={['340px', '500px', '820px', '1024px']}
        mx='auto'
        flexDir={'column'}
        justifyContent={'center'}
      >
        <Box mb={12}>
          <QuickTradeContainer />
        </Box>
        {address !== undefined && (
          <>
            <Box
              w={['340px', '500px', '820px', '1024px']}
              px={[0, 0, '20px', 0]}
              pb={'50px'}
            >
              <SectionTitle title='Balances' />
              <BalanceTable />
            </Box>
            <Box
              w={['340px', '500px', '820px', '1024px']}
              px={[0, 0, '20px', 0]}
            >
              <SectionTitle
                title='Transaction History'
                itemRight={renderCsvDownloadButton}
              />
              <TransactionHistoryTable items={historyItems.slice(0, 20)} />
            </Box>
          </>
        )}
      </Flex>
    </Page>
  )
}

export default Dashboard
