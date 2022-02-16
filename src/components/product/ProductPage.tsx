import { Box, Flex } from '@chakra-ui/react'

import Page from 'components/Page'
import { getPriceChartData } from 'components/product/PriceChartData'
import { Token } from 'constants/tokens'
import {
  TokenMarketDataValues,
  useMarketData,
} from 'providers/MarketData/MarketDataProvider'
import { SetComponent } from 'providers/SetComponents/SetComponentsProvider'
import { getPricesChanges } from 'utils/priceChange'

import MarketChart from './MarketChart'
import ProductComponentsTable from './ProductComponentsTable'
import ProductHeader from './ProductHeader'

const ProductPage = (props: {
  tokenData: Token
  marketData: TokenMarketDataValues
  components: SetComponent[]
}) => {
  const { selectLatestMarketData } = useMarketData()

  const marketData = getPriceChartData([props.marketData])

  const price = `$${selectLatestMarketData(
    props.marketData.hourlyPrices
  ).toFixed(2)}`

  const priceChanges = getPricesChanges(props.marketData.hourlyPrices ?? [])
  // ['+10.53 ( +5.89% )', '+6.53 ( +2.89% )', ...]
  const priceChangesFormatted = priceChanges.map((change) => {
    const plusOrMinus = change.isPositive ? '+' : '-'
    return `${plusOrMinus}$${change.abs.toFixed(
      2
    )} ( ${plusOrMinus} ${change.rel.toFixed(2)}% )`
  })

  // TODO: find a way to dynamically capture the page's width so it can be passed
  // to the chart (which does not take dynamic values) - same on dashboard

  return (
    <Page>
      <Flex direction='column' w='80vw' m='0 auto'>
        <Box my='48px'>
          <ProductHeader tokenData={props.tokenData} />
        </Box>
        <Flex direction='column'>
          <MarketChart
            marketData={marketData}
            prices={[price]}
            priceChanges={priceChangesFormatted}
            options={{ width: 1048, hideYAxis: false }}
          />
          <ProductComponentsTable components={props.components} />
        </Flex>
      </Flex>
    </Page>
  )
}

export default ProductPage
