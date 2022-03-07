import { useEffect, useState } from 'react'

import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { useEthers } from '@usedapp/core'

import Page from 'components/Page'
import { getPriceChartData } from 'components/product/PriceChartData'
import { Token } from 'constants/tokens'
import {
  TokenMarketDataValues,
  useMarketData,
} from 'providers/MarketData/MarketDataProvider'
import { SetComponent } from 'providers/SetComponents/SetComponentsProvider'
import {
  getPricesChanges,
  getFormattedChartPriceChanges,
} from 'utils/priceChange'
import { getTokenSupply } from 'utils/setjsApi'

import MarketChart, { PriceChartRangeOption } from './MarketChart'
import ProductComponentsTable from './ProductComponentsTable'
import ProductHeader from './ProductHeader'
import ProductPageSectionHeader from './ProductPageSectionHeader'
import ProductStats, { ProductStat } from './ProductStats'

function getStatsForToken(
  tokenData: Token,
  marketData: TokenMarketDataValues,
  currentSupply: number
): ProductStat[] {
  const dailyPriceRange = PriceChartRangeOption.DAILY_PRICE_RANGE
  const hourlyDataInterval = 24

  let formatter = Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    notation: 'compact',
  })

  let supplyFormatter = Intl.NumberFormat('en')

  const marketCap =
    marketData.marketcaps
      ?.slice(-dailyPriceRange * hourlyDataInterval)
      ?.slice(-1)[0]
      ?.slice(-1)[0] ?? 0
  const marketCapFormatted = formatter.format(marketCap)

  const supplyFormatted = supplyFormatter.format(currentSupply)

  const volume =
    marketData.volumes
      ?.slice(-dailyPriceRange * hourlyDataInterval)
      ?.slice(-1)[0]
      ?.slice(-1)[0] ?? 0
  const volumeFormatted = formatter.format(volume)

  return [
    { title: 'Market Cap', value: marketCapFormatted },
    { title: 'Volume', value: volumeFormatted },
    { title: 'Current Supply', value: supplyFormatted },
    { title: 'Streaming Fee', value: tokenData.fees?.streamingFee ?? 'n/a' },
  ]
}

const ProductPage = (props: {
  tokenData: Token
  marketData: TokenMarketDataValues
  components: SetComponent[]
}) => {
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const { marketData, tokenData } = props

  const { chainId, library } = useEthers()
  const { selectLatestMarketData } = useMarketData()

  const [currentTokenSupply, setCurrentTokenSupply] = useState(0)

  useEffect(() => {
    const tokenAddress = tokenData.address

    if (
      tokenAddress === undefined ||
      library === undefined ||
      chainId === undefined
    ) {
      return
    }

    const fetchSupply = async () => {
      const setDetails = await getTokenSupply(library, [tokenAddress], chainId)
      const e18 = BigNumber.from('1000000000000000000')
      const supply = setDetails[0].totalSupply.div(e18).toNumber()
      setCurrentTokenSupply(supply)
    }

    fetchSupply()
  }, [tokenData])

  const priceChartData = getPriceChartData([marketData])

  const price = `$${selectLatestMarketData(marketData.hourlyPrices).toFixed(2)}`
  const priceChanges = getPricesChanges(marketData.hourlyPrices ?? [])
  const priceChangesFormatted = getFormattedChartPriceChanges(priceChanges)

  const stats = getStatsForToken(tokenData, marketData, currentTokenSupply)

  const chartWidth = window.outerWidth < 400 ? window.outerWidth : 1048
  const chartHeight = window.outerWidth < 400 ? 300 : 400

  return (
    <Page>
      <Flex direction='column' w={['100%', '80vw']} m='0 auto'>
        <Box my={['16px', '48px']}>
          <ProductHeader
            isMobile={isMobile ?? false}
            tokenData={props.tokenData}
          />
        </Box>
        <Flex direction='column'>
          <MarketChart
            marketData={priceChartData}
            prices={[price]}
            priceChanges={priceChangesFormatted}
            options={{
              width: chartWidth,
              height: chartHeight,
              hideYAxis: false,
            }}
          />
          <ProductPageSectionHeader title='Stats' topMargin='120px' />
          <ProductStats stats={stats} />
          <ProductPageSectionHeader title='Allocations' />
          <ProductComponentsTable components={props.components} />
        </Flex>
      </Flex>
    </Page>
  )
}

export default ProductPage
