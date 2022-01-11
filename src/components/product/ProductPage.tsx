import { Flex } from '@chakra-ui/react'

import Page from 'components/Page'
import { ProductToken } from 'constants/productTokens'
import { TokenMarketDataValues } from 'contexts/MarketData/MarketDataProvider'

import MarketChart from './MarketChart'
import ProductHeader from './ProductHeader'

const ProductPage = (props: {
  tokenData: ProductToken
  marketData: TokenMarketDataValues
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
          <Flex width='40vw'>{props.children}</Flex>
        </Flex>
      </Flex>
    </Page>
  )
}

export default ProductPage
