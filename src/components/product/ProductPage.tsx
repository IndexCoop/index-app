import { useEffect, useState } from 'react'

import { Box, Flex } from '@chakra-ui/react'
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
import { getPricesChanges } from 'utils/priceChange'
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
  // ['+10.53 ( +5.89% )', '+6.53 ( +2.89% )', ...]
  const priceChangesFormatted = priceChanges.map((change) => {
    const plusOrMinus = change.isPositive ? '+' : '-'
    return `${plusOrMinus}$${change.abs.toFixed(
      2
    )} ( ${plusOrMinus} ${change.rel.toFixed(2)}% )`
  })

  const stats = getStatsForToken(tokenData, marketData, currentTokenSupply)

  return (
    <Page>
      <Flex direction='column' w={['100%', '80vw']} m='0 auto'>
        <Box my='48px'>
          <ProductHeader tokenData={props.tokenData} />
        </Box>
        <Flex direction='column'>
          <MarketChart
            marketData={priceChartData}
            prices={[price]}
            priceChanges={priceChangesFormatted}
            options={{ width: 1048, hideYAxis: false }}
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
