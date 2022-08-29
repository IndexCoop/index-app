import { useEffect, useState } from 'react'

import { Box } from '@chakra-ui/react'

import Page from 'components/Page'
import PageTitle from 'components/PageTitle'
import {
  ProductFilter,
  ProductsFilter,
} from 'components/products/ProductsFilter'
import ProductsTable from 'components/products/ProductsTable'
import Indices, { IndexToken, IndexType, Token } from 'constants/tokens'
import { TokenContextKeys, useMarketData } from 'providers/MarketData'

/*  Disabling for 1Y time period because it saves
  us a lot of Coingecko API calls.
  To enable, add Max History call in coingeckoApi.ts
*/
export interface ProductsTableProduct extends Token {
  performance: {
    '1D'?: number
    '1W'?: number
    '1M'?: number
    '3M'?: number
    // '1Y'?: number
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
  // ['1Y', 365],
]

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
  if (daysOfComparison <= 90) {
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
  product: Token
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

  const getTokenMarketData = (tokenContextKey?: TokenContextKeys) => {
    if (
      tokenContextKey &&
      tokenContextKey !== 'selectLatestMarketData' &&
      tokenContextKey !== 'selectMarketDataByToken'
    ) {
      return {
        hourlyPrices: marketData[tokenContextKey]?.hourlyPrices,
        prices: marketData[tokenContextKey]?.prices,
      }
    }
  }

  const productsFiltered = (filter: ProductFilter): ProductsTableProduct[] => {
    switch (filter) {
      case ProductFilter.all:
        return productsWithMarketData(Indices)

      case ProductFilter.leverage:
        return productsWithMarketData(
          Indices.filter((index) =>
            index.indexTypes.includes(IndexType.leverage)
          )
        )
      case ProductFilter.thematic:
        return productsWithMarketData(
          Indices.filter((index) =>
            index.indexTypes.includes(IndexType.thematic)
          )
        )
      case ProductFilter.yield:
        return productsWithMarketData(
          Indices.filter((index) => index.indexTypes.includes(IndexType.yield))
        )
    }
  }

  const productsWithMarketData = (indices: Token[]) =>
    indices
      .filter((product) => product.symbol !== IndexToken.symbol)
      .map((product) => {
        return appendProductPerformance({
          product,
          ...getTokenMarketData(product.tokenContextKey),
        })
      })

  const [selectedFilter, setSelectedFilter] = useState(ProductFilter.all)
  const [products, setProducts] = useState(productsWithMarketData(Indices))

  useEffect(() => {
    const products = productsFiltered(selectedFilter)
    setProducts(products)
  }, [marketData, selectedFilter])

  const onSelectFilter = (filter: ProductFilter) => {
    if (selectedFilter === filter) return
    setSelectedFilter(filter)
  }

  return (
    <Page>
      <Box w='100%'>
        <PageTitle
          title='Discover Index Coop Indices'
          subtitle='Simple yet powerful crypto investment themes'
        />
        <ProductsFilter
          onSelectFilter={onSelectFilter}
          selected={selectedFilter}
        />
        <ProductsTable products={products} />
      </Box>
    </Page>
  )
}

export default Products
