import { Flex } from '@chakra-ui/react'

import Page from 'components/Page'
import { ProductToken } from 'constants/productTokens'
import { TokenMarketDataValues } from 'contexts/MarketData/MarketDataProvider'
import { SetComponent } from 'contexts/SetComponents/SetComponentsProvider'

import MarketChart from './MarketChart'
import ProductComponentsTable from './ProductComponentsTable'
import ProductHeader from './ProductHeader'

const ProductPage = (props: {
  tokenData: ProductToken
  marketData: TokenMarketDataValues
  components: SetComponent[]
  children?: JSX.Element
}) => {
  return (
    <Page>
      <Flex direction='column'>
        <ProductHeader tokenData={props.tokenData} />
        <Flex direction='column' justifyContent='space-around'>
          <MarketChart
            productToken={props.tokenData}
            marketData={props.marketData}
          />
          <ProductComponentsTable components={props.components} />
          <Flex width='40vw'>{props.children}</Flex>
        </Flex>
      </Flex>
    </Page>
  )
}

export default ProductPage
