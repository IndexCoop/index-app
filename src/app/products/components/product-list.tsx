'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ProductColHeader } from '@/app/products/components/product-col-header'
import { ProductRowItem } from '@/app/products/components/product-row-item'
import { productTokens } from '@/app/products/constants/tokens'
import { ProductRow } from '@/app/products/types/product'
import { SortBy, SortDirection } from '@/app/products/types/sort'
import { fetchApy } from '@/app/products/utils/api'
import { sortProducts } from '@/app/products/utils/sort'
import { formatWei } from '@/lib/utils'
import {
  IndexDataMetric,
  IndexDataProvider,
} from '@/lib/utils/api/index-data-provider'

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
    const indexDataProvider = new IndexDataProvider()
    const analyticsPromises = Promise.all(
      productTokens.map((token) =>
        token.address
          ? indexDataProvider.getTokenMetrics({
              tokenAddress: token.address,
              metrics: [
                IndexDataMetric.MarketCap,
                IndexDataMetric.Pav,
                IndexDataMetric.NavChange,
              ],
            })
          : null,
      ),
    )
    const apyPromises = Promise.all(
      productTokens.map((token) =>
        token.hasApy && token.symbol ? fetchApy(token.symbol) : null,
      ),
    )
    const [analyticsResults, apyResults] = await Promise.all([
      analyticsPromises,
      apyPromises,
    ])

    const products = productTokens.map((token, idx) => ({
      ...token,
      price: analyticsResults[idx]?.nav,
      delta: analyticsResults[idx]?.navChange,
      tvl: analyticsResults[idx]?.marketCap,
      apy:
        apyResults[idx]?.apy !== undefined && apyResults[idx].apy !== '0'
          ? Number(formatWei(apyResults[idx].apy))
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
        },
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
      },
    )
  }

  return (
    <div className='bg-ic-white border-ic-gray-100 mt-8 w-full overflow-auto rounded-3xl border py-4 shadow-sm'>
      <div className='hidden justify-between py-6 md:flex'>
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
          className='pr-8 !text-right'
          onClick={() => handleSortClick(SortBy.TVL)}
          sortDirection={sortBy === SortBy.TVL ? sortDirection : null}
        >
          TVL
        </ProductColHeader>
      </div>
      <div className='divide-ic-gray-200 flex flex-col divide-y md:divide-y-0'>
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
