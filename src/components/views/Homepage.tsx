import { useEffect, useState } from 'react'

import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import AllocationChart, { Position } from 'components/dashboard/AllocationChart'
import QuickTrade from 'components/dashboard/QuickTrade'
import { assembleHistoryItems } from 'components/dashboard/TransactionHistoryItems'
import TransactionHistoryTable, {
  TransactionHistoryItem,
} from 'components/dashboard/TransactionHistoryTable'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import MarketChart from 'components/product/MarketChart'
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
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'
import { useSetComponents } from 'contexts/SetComponents/SetComponentsProvider'
import { useBalances } from 'hooks/useBalances'
import { getTransactionHistory } from 'utils/alchemyApi'

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

function getNumber(balance: BigNumber | undefined): number {
  if (balance === undefined) return -1
  return parseInt(balance.toString())
}

function getPosition(
  title: string,
  bigNumber: BigNumber | undefined,
  total: BigNumber,
  backgroundColor: string
): Position | null {
  if (
    bigNumber === undefined ||
    bigNumber.isZero() ||
    bigNumber.isNegative() ||
    total.isZero() ||
    total.isNegative()
  ) {
    return null
  }

  const value = getNumber(bigNumber)
  const percent = `${bigNumber.div(total).div(18).toString()}%`

  return {
    title,
    backgroundColor,
    color: '',
    percent,
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
  const { account } = useEthers()
  const { mvi } = useMarketData()
  const { dpiComponents } = useSetComponents()

  const [historyItems, setHistoryItems] = useState<TransactionHistoryItem[]>([])

  useEffect(() => {
    if (account === null || account === undefined) return
    const fetchHistory = async () => {
      const transactions = await getTransactionHistory(account)
      const historyItems = assembleHistoryItems(transactions)
      setHistoryItems(historyItems)
    }
    fetchHistory()
  }, [account])

  const tempPositions = [
    { title: 'DPI', value: dpiBalance, color: '#8150E6' },
    { title: 'MVI', value: mviBalance, color: '#f165dd' },
    { title: 'DATA', value: dataBalance, color: '#fb002b' },
    { title: 'BED', value: bedBalance, color: '#ED1C24' },
    { title: 'GMI', value: gmiBalance, color: '#fc0006' },
    { title: 'ETH2x-FLI', value: ethFliBalance, color: '#44007f' },
    { title: 'ETH2x-FLI-P', value: ethFliPBalance, color: '#44007f' },
    { title: 'BTC2x-FLI', value: btcFliBalance, color: 'yellow' },
  ]

  // const totalBalance: BigNumber = tempPositions
  //   .map((pos) => {
  //     return pos.value ?? BigNumber.from('0')
  //   })
  //   .reduce((prev, curr) => {
  //     return prev.add(curr)
  //   })

  // const positions = tempPositions.flatMap((tempPosition) => {
  //   const position = getPosition(
  //     tempPosition.title,
  //     tempPosition.value,
  //     totalBalance,
  //     tempPosition.color
  //   )
  //   if (position === null || tempPosition.value === undefined) {
  //     return []
  //   }
  //   return [position]
  // })

  const positions: Position[] = [
    getPosition(
      'BED',
      BigNumber.from('35'),
      BigNumber.from('100'),
      tempPositions[0].color
    )!,
    getPosition(
      'MVI',
      BigNumber.from('30'),
      BigNumber.from('100'),
      tempPositions[1].color
    )!,
    getPosition(
      'DATA',
      BigNumber.from('16'),
      BigNumber.from('100'),
      tempPositions[2].color
    )!,
    getPosition(
      'DPI',
      BigNumber.from('12'),
      BigNumber.from('100'),
      tempPositions[3].color
    )!,
    getPosition(
      'OTHERS',
      BigNumber.from('5'),
      BigNumber.from('100'),
      tempPositions[4].color
    )!,
  ]
  // console.log(positions)

  // TODO: width should be dynamic
  // TODO: what's min width?
  const width = 1280

  return (
    <Page>
      <Box minW={width} mx='auto'>
        <PageTitle title='My Dashboard' subtitle='' />
        <Box my={12}>
          <MarketChart
            productToken={MetaverseIndex}
            marketData={mvi || {}}
            width={width}
          />
          <Flex direction='row'>
            <Flex direction='column' grow='1' flexBasis='0'>
              <AllocationChart positions={positions} />
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
