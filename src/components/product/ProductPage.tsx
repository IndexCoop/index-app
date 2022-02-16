import { Flex } from '@chakra-ui/react'

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
  children?: JSX.Element
}) => {
  const { selectLatestMarketData } = useMarketData()

  const price = `$${selectLatestMarketData(
    props.marketData.hourlyPrices
  ).toFixed()}`
  const prices = [price]

  const priceChange = ''
  const priceChanges = [priceChange]

  const marketData = getPriceChartData([props.marketData])
  return (
    <Page>
      <Flex direction='column' width='100vw'>
        <ProductHeader tokenData={props.tokenData} />
        <Flex direction='column' justifyContent='space-around' width='70vw'>
          <MarketChart
            marketData={marketData}
            prices={prices}
            priceChanges={priceChanges}
            options={{}}
          />
          <ProductComponentsTable components={props.components} />
          <Flex>{props.children}</Flex>
        </Flex>
      </Flex>
    </Page>
  )
}

export default ProductPage
