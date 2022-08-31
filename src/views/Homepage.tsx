import { useEffect, useRef, useState } from 'react'

import { useNetwork } from 'wagmi'

import { Box, Flex } from '@chakra-ui/react'

import Page from 'components/page/Page'
import SectionTitle from 'components/page/SectionTitle'
import BalanceTable from 'components/tables/BalanceTable'
import TransactionHistoryTable, {
  TransactionHistoryItem,
} from 'components/tables/TransactionHistoryTable'
import DownloadCsvView from 'components/tables/TransactionHistoryTable/DownloadCsvView'
import { assembleHistoryItems } from 'components/tables/TransactionHistoryTable/TransactionHistoryItems'
import QuickTradeContainer from 'components/trade'
import { useWallet } from 'hooks/useWallet'
import { getTransactionHistory } from 'utils/api/alchemyApi'
import { logEvent } from 'utils/api/analytics'
import { exportCsv } from 'utils/exportToCsv'

const Homepage = () => {
  const { address, isConnected } = useWallet()
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
        alignItems={'center'}
      >
        <Box mb={12} w={['inherit', '500px']}>
          <QuickTradeContainer />
        </Box>
        {isConnected && (
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

export default Homepage
