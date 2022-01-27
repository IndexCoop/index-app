import { Box } from '@chakra-ui/react'

import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import ProductsTable from 'components/products/ProductsTable'
import Indices, { IndexToken, ProductToken } from 'constants/productTokens'
import {
  TokenContext,
  useMarketData,
} from 'contexts/MarketData/MarketDataProvider'

export interface ProductsTableProduct extends ProductToken {
  performance: {
    '1D'?: number
    '1W'?: number
    '1M'?: number
    '3M'?: number
    '1Y'?: number
  }
}

export const PriceChangeIntervals: [
  keyof ProductsTableProduct['performance'],
  number
][] = [
  ['1D', 1],
  ['1W', 7],
  ['1M', 30],
  ['3M', 90],
  ['1Y', 365],
]

type TokenContextKeys = keyof TokenContext

type PriceChangesProps = {
  daysOfComparison: number
  hourlyPrices?: number[][]
  prices?: number[][]
}

export const calculatePriceChange = ({
  daysOfComparison,
  hourlyPrices,
  prices,
}: PriceChangesProps) => {
  if (daysOfComparison <= 30) {
    const startPrice = hourlyPrices
      ? hourlyPrices.slice(-24 * daysOfComparison)[0][1]
      : 1
    const hourlyPricesLength = hourlyPrices ? hourlyPrices.length - 1 : 0
    const latestPrice = hourlyPrices ? hourlyPrices[hourlyPricesLength][1] : 1
    return ((latestPrice - startPrice) / startPrice) * 100
  } else if (prices && prices?.length > daysOfComparison) {
    const startPrice = prices[prices.length - daysOfComparison][1]
    const latestPrice = prices[prices.length - 1][1]
    return ((latestPrice - startPrice) / startPrice) * 100
  }
  return 0
}

const appendProductPerformance = ({
  product,
  hourlyPrices,
  prices,
}: {
  product: ProductToken
  hourlyPrices?: number[][]
  prices?: number[][]
}): ProductsTableProduct => {
  return PriceChangeIntervals.reduce(
    (product, interval) => {
      const [dateString, daysOfComparison] = interval
      const priceChange = calculatePriceChange({
        daysOfComparison,
        hourlyPrices,
        prices,
      })

      product.performance = {
        ...product.performance,
        [dateString]: priceChange,
      }

      return product
    },
    { ...product, performance: {} }
  )
}

const Products = () => {
  const marketData = useMarketData()

  const getTokenMarketData = (tokenContextKey: TokenContextKeys) => {
    if (tokenContextKey !== 'selectLatestMarketData') {
      return {
        hourlyPrices: marketData[tokenContextKey]?.hourlyPrices,
        prices: marketData[tokenContextKey]?.prices,
      }
    }
  }

  const productsWithMarketData = Indices.filter(
    (product) => product.symbol !== IndexToken.symbol
  ).map((product) => {
    return appendProductPerformance({
      product,
      ...getTokenMarketData(product.tokenContextKey as TokenContextKeys),
    })
  })

  return (
    <Page>
      <Box minW='1280px' mx='auto'>
        <PageTitle
          title='Discover Index Coop Indices'
          subtitle='simple yet powerful crypto investment themes'
        />
        <Box>
          <ProductsTable products={productsWithMarketData} />
        </Box>
      </Box>
    </Page>
  )
}

export default Products
