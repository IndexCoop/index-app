'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { formatEther } from 'viem'
import { ProductColHeader } from '@/app/products/components/product-col-header'
import { ProductRowItem } from '@/app/products/components/product-row-item'
import { productTokens } from '@/app/products/constants/tokens'
import { ProductRow } from '@/app/products/types/product'
import { SortBy, SortDirection } from '@/app/products/types/sort'
import {
  fetchApy,
  fetchMarketData,
  fetchAnalytics,
} from '@/app/products/utils/api'
import { sortProducts } from '@/app/products/utils/sort'

const THIRTY_SECONDS_IN_MS = 30 * 1000

export function ProductList() {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<ProductRow[]>(productTokens)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sortBy = searchParams.get('sort')
  const sortDirection = searchParams.get('dir') ?? SortDirection.DESC

  async function fetchProducts() {
    const analyticsPromises = Promise.all(
      productTokens.map((token) =>
        token.shouldUseAnalytics && token.symbol
          ? fetchAnalytics(token.symbol)
          : null
      )
    )
    const coingeckoPromises = Promise.all(
      productTokens.map((token) => !token.shouldUseAnalytics ? fetchMarketData(token.address!) : null)
    )
    const apyPromises = Promise.all(
      productTokens.map((token) =>
        token.hasApy && token.symbol ? fetchApy(token.symbol) : null
      )
    )
    const [analyticsResults, coingeckoResults, apyResults] =
      await Promise.all([analyticsPromises, coingeckoPromises, apyPromises])

    const products = productTokens.map((token, idx) => ({
      ...token,
      price: token.shouldUseAnalytics
        ? analyticsResults[idx]?.navPrice
        : coingeckoResults[idx]?.current_price.usd,
      delta: token.shouldUseAnalytics
        ? analyticsResults[idx]?.change24h ?? 0
        : coingeckoResults[idx]?.price_change_percentage_24h_in_currency.usd ?? 0,
      tvl: token.shouldUseAnalytics
        ? analyticsResults[idx]?.marketCap
        : coingeckoResults[idx]?.market_cap.usd,
      apy: apyResults[idx]?.apy
        ? Number(formatEther(apyResults[idx].apy))
        : null,
    }))
    setProducts(sortProducts(products, sortBy, sortDirection))
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchProducts()
    }, THIRTY_SECONDS_IN_MS)

    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [sortBy, sortDirection])

  useEffect(() => {
    setProducts((products) => sortProducts(products, sortBy, sortDirection))
  }, [sortBy, sortDirection])

  const handleSortClick = (clickedSortBy: string) => {
    if (isLoading) return
    if (sortBy === null || sortBy !== clickedSortBy) {
      return router.push(
        `${pathname}?${new URLSearchParams({
          sort: clickedSortBy,
        }).toString()}`,
        {
          scroll: false,
        }
      )
    }

    // User clicked the current active filter
    const newSortDirection =
      sortDirection === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC
    router.push(
      `${pathname}?${new URLSearchParams({
        sort: searchParams.get('sort') as string,
        dir: newSortDirection,
      }).toString()}`,
      {
        scroll: false,
      }
    )
  }

  return (
    <div className='bg-ic-white rounded-3xl shadow-sm border border-ic-gray-100 w-full overflow-scroll py-4 mt-8'>
      <div className='py-6 justify-between hidden md:flex'>
        <ProductColHeader
          className='!min-w-[400px] max-w-[460px] pl-[62px] !text-left'
          onClick={() => handleSortClick(SortBy.Product)}
          sortDirection={sortBy === SortBy.Product ? sortDirection : null}
        >
          Product
        </ProductColHeader>
        <ProductColHeader
          onClick={() => handleSortClick(SortBy.Type)}
          sortDirection={sortBy === SortBy.Type ? sortDirection : null}
        >
          Type
        </ProductColHeader>
        <ProductColHeader
          onClick={() => handleSortClick(SortBy.Theme)}
          sortDirection={sortBy === SortBy.Theme ? sortDirection : null}
        >
          Theme
        </ProductColHeader>
        <ProductColHeader
          className='!min-w-[130px] !text-right'
          onClick={() => handleSortClick(SortBy.Price)}
          sortDirection={sortBy === SortBy.Price ? sortDirection : null}
        >
          Current Price
        </ProductColHeader>
        <ProductColHeader
          className='!text-right'
          onClick={() => handleSortClick(SortBy.Delta)}
          sortDirection={sortBy === SortBy.Delta ? sortDirection : null}
        >
          24h
        </ProductColHeader>
        <ProductColHeader
          onClick={() => handleSortClick(SortBy.APY)}
          sortDirection={sortBy === SortBy.APY ? sortDirection : null}
        >
          APY
        </ProductColHeader>
        <ProductColHeader
          className='!text-right pr-8'
          onClick={() => handleSortClick(SortBy.TVL)}
          sortDirection={sortBy === SortBy.TVL ? sortDirection : null}
        >
          TVL
        </ProductColHeader>
      </div>
      <div className='flex flex-col divide-y md:divide-y-0 divide-ic-gray-200'>
        {products.map((product) => (
          <ProductRowItem
            key={product.symbol}
            isLoading={isLoading}
            product={product}
          />
        ))}
      </div>
    </div>
  )
}
