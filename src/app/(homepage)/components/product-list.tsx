'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { formatEther } from 'viem'
import { ProductColHeader } from '@/app/(homepage)/components/product-col-header'
import { ProductRowItem } from '@/app/(homepage)/components/product-row-item'
import { productTokens } from '@/app/(homepage)/constants/tokens'
import { ProductRow } from '@/app/(homepage)/types/product'
import { SortBy, SortDirection } from '@/app/(homepage)/types/sort'
import { fetchAnalytics, fetchApy } from '@/app/(homepage)/utils/index-api'
import { sortProducts } from '@/app/(homepage)/utils/sort'

export function ProductList() {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<ProductRow[]>(productTokens)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sortBy = searchParams.get('sort')
  const sortDirection = searchParams.get('dir') ?? SortDirection.DESC

  useEffect(() => {
    async function fetchProducts() {
      const analyticsPromises = Promise.all(
        productTokens.map((token) => token.symbol ? fetchAnalytics(token.symbol) : null)
      )
      const apyPromises = Promise.all(
        productTokens.map((token) =>
          token.hasApy && token.symbol ? fetchApy(token.symbol) : null,
        ),
      )
      const [analytics, apys] = await Promise.all([
        analyticsPromises,
        apyPromises,
      ])

      const products = productTokens.map((token, idx) => ({
        ...token,
        price: analytics[idx]?.navPrice,
        delta: analytics[idx]?.change24h,
        tvl: analytics[idx]?.marketCap,
        apy: apys[idx]?.apy ? Number(formatEther(apys[idx].apy)) : null,
      }))
      setProducts(sortProducts(products, sortBy, sortDirection))
      setIsLoading(false)
    }
    fetchProducts()
    // eslint-disable-next-line
  }, [])

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
