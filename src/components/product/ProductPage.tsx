import { Box, Flex } from '@chakra-ui/react'

import Page from 'components/Page'
import { getPriceChartData } from 'components/product/PriceChartData'
import { ProductToken } from 'constants/productTokens'
import {
  TokenMarketDataValues,
  useMarketData,
} from 'providers/MarketData/MarketDataProvider'
import { SetComponent } from 'providers/SetComponents/SetComponentsProvider'

import MarketChart from './MarketChart'
import ProductComponentsTable from './ProductComponentsTable'
import ProductHeader from './ProductHeader'

const ProductPage = (props: {
  tokenData: ProductToken
  marketData: TokenMarketDataValues
  components: SetComponent[]
}) => {
  const { selectLatestMarketData } = useMarketData()

  const price = `$${selectLatestMarketData(
    props.marketData.hourlyPrices
  ).toFixed(2)}`
  const prices = [price]

  const priceChange = ''
  const priceChanges = [priceChange]

  const marketData = getPriceChartData([props.marketData])

  // TODO: find a way to dynamically capture the page's width so it can be passed
  // to the chart (which does not take dynamic values)

  return (
    <Page>
      <Flex direction='column' w='80vw' m='0 auto'>
        <Box my='48px'>
          <ProductHeader tokenData={props.tokenData} />
        </Box>
        <Flex direction='column'>
          <MarketChart
            marketData={marketData}
            prices={prices}
            priceChanges={priceChanges}
            options={{ width: 1048, hideYAxis: false }}
          />
          <ProductComponentsTable components={props.components} />
        </Flex>
      </Flex>
    </Page>
  )
}

export default ProductPage
