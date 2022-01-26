import { Box, Flex, Link, Text } from '@chakra-ui/react'

import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import ProductsTable from 'components/products/ProductsTable'
import SectionTitle from 'components/SectionTitle'
import Indices, { ProductToken } from 'constants/productTokens'
import { useMarketData } from 'contexts/MarketData/MarketDataProvider'
import { useSetComponents } from 'contexts/SetComponents/SetComponentsProvider'

export interface ProductsTableProduct extends ProductToken {
  performance?: {
    '1D': number
    '1W': number
    '1M': number
    '3M': number
    '1Y': number
  }
}

const Products = () => {
  return (
    <Page>
      <Box minW='1280px' mx='auto'>
        <PageTitle
          title='Discover Index Coop Indices'
          subtitle='simple yet powerful index products to help you access crypto investment themes'
        />
        <Box>
          <ProductsTable products={Indices} />
        </Box>
      </Box>
    </Page>
  )
}

export default Products
